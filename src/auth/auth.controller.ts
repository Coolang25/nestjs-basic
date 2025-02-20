import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private roleService: RolesService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @Throttle(5, 60) // GHi đè cấu hình trong app.module
    @ApiBody({ type: UserLoginDto })
    @Post('/login')
    @ResponseMessage('Login user')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Register user')
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ResponseMessage('Get account')
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.roleService.findOne(user.role._id) as any
        user.permissions = temp.permissions
        return { user };
    }

    @Public()
    @ResponseMessage('Refresh token')
    @Get('/refresh')
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response) {

        const refreshToken = request.cookies["refresh_token"]
        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage('Logout')
    @Get('/logout')
    handleLogout(
        @Res({ passthrough: true }) response: Response, @User() user: IUser) {

        return this.authService.logout(response, user);
    }
}
