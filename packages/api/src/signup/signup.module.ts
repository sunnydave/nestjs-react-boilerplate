import { Module } from "@nestjs/common";
import { SignupService } from "./signup.service";
import { SignupController } from "./signup.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignupEntity } from "./signup.entity";
import { OrganizationsModule } from "../organizations/organizations.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SignupEntity]),
    OrganizationsModule,
    UsersModule,
  ],
  providers: [SignupService],
  controllers: [SignupController],
})
export class SignupModule {}
