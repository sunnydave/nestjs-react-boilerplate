import {Controller, Post, UseGuards, Request, Param} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {Public} from "./decorators/public.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() request) {
        return this.authService.login(request.user);
    }

    @Public()
    @Post('acceptInvite/:inviteString')
    async acceptInvite(@Param('inviteString') inviteString: string) {
        const response = await this.authService.acceptInvite(inviteString);
        return response;
    }
}
