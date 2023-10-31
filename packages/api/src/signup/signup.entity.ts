import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/base/entity/base.entity";

@Entity()
export class SignupEntity extends BaseEntity {
  @Column()
  email: string;

  @Column({
    default: false,
  })
  isSignupComplete: boolean;

  @Column()
  currentStep: string;

  @Column()
  location: string;

  @Column({
    default: true,
  })
  isSignedUpForEmails: boolean;
}
