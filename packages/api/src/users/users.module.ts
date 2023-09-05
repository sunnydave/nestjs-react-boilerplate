import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserInvite} from "./user-invite.entity";
import {User} from "./user.entity";

@Module({
  imports:[TypeOrmModule.forFeature([User, UserInvite])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService],
})
export class UsersModule {}
