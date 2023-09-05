import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {User} from "./user.entity";
import {UserInvite} from "./user-invite.entity";
import {Organization} from "../organizations/organization.entity";
import { v4 as uuidv4 } from 'uuid';
import {Role} from "./role.enum";
import {CreateUserDto} from "./dto/create-user.dto";
import moment from "moment";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserInvite)
        private userInviteRepository: Repository<UserInvite>,
    ) {}

    async checkEmailAvailable(email: string): Promise<boolean> {
        const emailCount = await this.userRepository.count({
            where: {
                email: email,
            },
        });
        return !(emailCount && emailCount > 0);
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                email: email,
            },
            relations: ['organization', 'client'],
        });
    }

    async findOneById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                id: id,
            },
            relations: ['organization', 'client'],
        });
    }

    async createNewOrgUser(
        createUserDto: CreateUserDto,
        orgId: number,
        isClientUser: boolean,
        clientId: number,
    ): Promise<string> {
        try {
            const org = new Organization();
            org.id = orgId;
            let user = new User();
            user.email = createUserDto.email;
            user.firstName = createUserDto.firstName;
            user.lastName = createUserDto.lastName;
            user.role = createUserDto.role;
            user.password = this.generatePassword(10);
            user.isActive = false;
            user.organization = org;
            user = await this.userRepository.save(user);
            let userInvite = new UserInvite();
            userInvite.user = user;
            userInvite.inviteString = uuidv4();
            userInvite.expiryDate = moment().add(7, 'days').toDate();
            userInvite = await this.userInviteRepository.save(userInvite);
            return userInvite.inviteString;
        } catch (e) {
            console.error(e);
            return '';
        }
    }

    async createUser(user: User): Promise<boolean> {
        try {
            await this.userRepository.save(user);
            return true;
        } catch (e) {
            return false;
        }
    }

    async findAllOrgUsers(user: User, page = 0, limit = 10): Promise<User[]> {
        try {
            const orgUsers = await this.userRepository.find({
                where: {
                    organization: user.organization,
                    role: In([Role.Org_Admin, Role.Org_User]),
                },
                relations: ['invites'],
                loadRelationIds: true,
                order: {
                    firstName: 'DESC',
                },
                skip: page,
                take: limit,
            });
            return orgUsers;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async countOrgActiveUsers(orgId: number): Promise<number> {
        const organization = new Organization();
        organization.id = orgId;
        const count = await this.userRepository.count({
            where: {
                organization: organization,
                isActive: true,
                role: In([Role.Org_Admin, Role.Org_User]),
            },
        });
        return count;
    }

    async acceptInvite(inviteString: string): Promise<User> {
        try {
            const userInvite = await this.userInviteRepository.findOne({
                where: {
                    inviteString: inviteString,
                    isExpired: false,
                    isAccepted: false,
                },
                relations: ['user'],
            });
            if (userInvite) {
                userInvite.isAccepted = true;
                await this.userInviteRepository.save(userInvite);
                await this.userRepository.update(userInvite.user.id, {
                    isActive: true,
                });
                const user = await this.findOneById(userInvite.user.id);
                return user;
            }
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async createDefaultSuperAdminUser(): Promise<boolean> {
        try {
            const countSuperAdmin = await this.userRepository.count({
                where: {
                    role: Role.Super_Admin,
                },
            });

            if (countSuperAdmin > 0) {
                console.log('Super Admin already exists');
                return false;
            } else {
                const user = new User();
                user.email = process.env.DEFAULT_SUPER_ADMIN_EMAIL;
                user.firstName = 'Sunny';
                user.lastName = 'Dave';
                user.role = Role.Super_Admin;
                user.password = process.env.DEFAULT_SUPER_ADMIN_PASSWORD;
                user.isActive = true;
                user.isEmailVerified = true;
                await this.userRepository.save(user);
                return true;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async changePassword(email: string, newPassword: string): Promise<boolean> {
        try {
            const user = await this.findOne(email);
            if (user) {
                user.password = newPassword;
                await this.userRepository.save(user);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private generatePassword(len: number): string {
        const length = len ? len : 10;
        const string = 'abcdefghijklmnopqrstuvwxyz'; //to upper
        const numeric = '0123456789';
        const punctuation = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        let character = '';
        const crunch = true;
        while (password.length < length) {
            const entity1 = Math.ceil(string.length * Math.random() * Math.random());
            const entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
            const entity3 = Math.ceil(
                punctuation.length * Math.random() * Math.random(),
            );
            let hold = string.charAt(entity1);
            hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
            character += hold;
            character += numeric.charAt(entity2);
            character += punctuation.charAt(entity3);
            password = character;
        }
        password = password
            .split('')
            .sort(function () {
                return 0.5 - Math.random();
            })
            .join('');
        return password.substr(0, len);
    }
}
