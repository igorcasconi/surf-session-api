import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../../supabase/supabase.service.ts';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  accessToken: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers['authorization'];
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token de acesso obrigatório!');
    }

    const { data, error } =
      await this.supabaseService.client.auth.getClaims(token);
    const claims = data?.claims;

    if (error || !claims || typeof claims.sub !== 'string') {
      throw new UnauthorizedException('Token de acesso inválido ou expirado!');
    }

    request.user = {
      id: claims.sub,
      email: typeof claims.email === 'string' ? claims.email : undefined,
    };

    request.accessToken = token;

    return true;
  }
}
