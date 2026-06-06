import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RefreshAuthGuard } from 'src/common/guards/refresh.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  refresh(
    @GetUser('id') userId: string,
    @GetUser('token') token: string,
  ) {
    return this.authService.refresh(userId, token);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: any) {
    return user;
  }

}
