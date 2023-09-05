import { IsEmail, IsString } from 'class-validator';
import { Role } from '../role.enum';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    role: Role;
}
