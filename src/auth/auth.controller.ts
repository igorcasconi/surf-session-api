import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { RegisterDto } from './dto/register.dto.ts';
import { LoginDto } from './dto/login.dto.ts';
import { RefreshTokenDto } from './dto/refresh-token.dto.ts';
import * as authGuard from './guards/auth.guard.ts';
import { CurrentUser } from './decorators/current-user.decorator.ts';

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
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @UseGuards(authGuard.AuthGuard)
  @Get('me')
  me(@CurrentUser() user: authGuard.AuthenticatedUser) {
    return { user };
  }
}
