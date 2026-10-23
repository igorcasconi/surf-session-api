import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;

  constructor(configService: ConfigService) {
    this.supabaseUrl = configService.getOrThrow<string>(
      'SUPABASE_URL',
    );

    this.supabaseKey = configService.getOrThrow<string>(
      'SUPABASE_PUBLISHABLE_KEY',
    );

    // Cliente usado nas operações de autenticação.
    this.client = createClient(
      this.supabaseUrl,
      this.supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  createUserClient(accessToken: string): SupabaseClient {
    return createClient(
      this.supabaseUrl,
      this.supabaseKey,
      {
        accessToken: async () => accessToken,
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }
}