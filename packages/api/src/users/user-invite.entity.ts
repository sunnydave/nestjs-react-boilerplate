import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base/entity/base.entity';
import { User } from './user.entity';

@Entity()
export class UserInvite extends BaseEntity {
    @Column()
    inviteString: string;

    @Column()
    expiryDate: Date;

    @ManyToOne(() => User, (user) => user.invites)
    user: User;

    @Column({
        default: false,
    })
    isExpired: boolean;

    @Column({
        default: false,
    })
    isAccepted: boolean;
}
