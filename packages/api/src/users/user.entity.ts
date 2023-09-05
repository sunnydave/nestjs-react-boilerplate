import { BaseEntity } from '../common/base/entity/base.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from '../organizations/organization.entity';
import { Role } from './role.enum';
import { UserInvite } from './user-invite.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        default: true,
    })
    isActive: boolean;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({
        default: false,
    })
    isEmailVerified: boolean;

    @ManyToOne(() => Organization)
    organization: Organization;

    @OneToMany(() => UserInvite, (userInvite) => userInvite.user)
    invites: UserInvite[];

    @Column()
    role: Role;

    @Column({
        nullable: true,
    })
    lastLoggedIn: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}
