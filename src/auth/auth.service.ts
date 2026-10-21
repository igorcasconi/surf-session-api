import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service.ts';
import { RegisterDto } from './dto/register.dto.ts';
import { LoginDto } from './dto/login.dto.ts';
import { RefreshTokenDto } from './dto/refresh-token.dto.ts';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(dto: RegisterDto) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          full_name: dto.fullName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      session: data.session
        ? {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at,
            tokenType: data.session.token_type,
          }
        : null,
      needsEmailConfirmation: !data.session,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Email ou senha inválidos!');
    }

    return {
      user: { id: data.user.id, email: data.user.email },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        tokenType: data.session.token_type,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const { data, error } =
      await this.supabaseService.client.auth.refreshSession({
        refresh_token: dto.refreshToken,
      });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Refresh token inválido ou expirado!');
    }

    return {
      user: { id: data.user.id, email: data.user.email },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        tokenType: data.session.token_type,
      },
    };
  }
}
