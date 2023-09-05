import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "./role.enum";
import {RolesAuthGuard} from "../auth/guards/roles-auth.guard";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "../auth/decorators/users.decorator";
import {ChangePasswordDto} from "./dto/change-password.dto";

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {}
    @Post()
    @Roles(Role.Org_Admin)
    @UseGuards(RolesAuthGuard)
    async create(@Body() createUserDto: CreateUserDto, @User() user) {
        const inviteString = await this.service.createNewOrgUser(
            createUserDto,
            user.org_id,
            false,
            0,
        );
        return { inviteString: inviteString };
    }

    @Get('/allOrgUsers')
    @Roles(Role.Org_Admin)
    @UseGuards(RolesAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async getAllOrgUser(
        @User() user,
        @Query() paginationQuery: { page: number; limit: number },
    ) {
        const orgUsers = await this.service.findAllOrgUsers(
            user,
            paginationQuery.page,
            paginationQuery.limit,
        );
        return orgUsers;
    }

    @Get('/orgActiveUserCount')
    @Roles(Role.Org_Admin)
    @UseGuards(RolesAuthGuard)
    async getOrgActiveUserCount(@User() user) {
        const count = await this.service.countOrgActiveUsers(user.org_id);
        return { count: count };
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getUserDetails(@User() user) {
        const response = await this.service.findOne(user.email);
        return response;
    }

    @Post('/changePassword')
    async changePassword(
        @User() user,
        @Body() newPasswordDto: ChangePasswordDto,
    ) {
        const response = await this.service.changePassword(
            user.email,
            newPasswordDto.newPassword,
        );
        return { status: response };
    }
}
