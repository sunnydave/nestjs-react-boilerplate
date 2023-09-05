import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {Role} from "../users/role.enum";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            org_id: user.role !== Role.Super_Admin ? user.organization.id : 0,
        };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role,
        };
    }

    async acceptInvite(inviteString: any) {
        const user = await this.userService.acceptInvite(inviteString);
        if (user) {
            const response = await this.login(user);
            return response;
        }
        return {};
    }
}
