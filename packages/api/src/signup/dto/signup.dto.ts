import { IsEmail } from "class-validator";

export class SignupDto {
  @IsEmail()
  readonly email: string;
}
