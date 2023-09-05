import { IsEmail, IsString } from 'class-validator';

export class CreateSuperAdminDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsString()
    readonly password: string;
}
