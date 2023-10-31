import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateOrgDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly subDomain: string;
}
