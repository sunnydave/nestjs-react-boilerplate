import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Organization} from "./organization.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Organization]),
        UsersModule
    ]
})
export class OrganizationsModule {}
