import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../supabase/supabase.service.ts';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  const supabaseUrl = 'https://example.supabase.co';
  const supabaseKey = 'test-publishable-key';
  const fakeClient = { from: vi.fn() };

  let configService: {
    getOrThrow: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    configService = {
      getOrThrow: vi.fn((key: string) => {
        const config: Record<string, string> = {
          SUPABASE_URL: supabaseUrl,
          SUPABASE_PUBLISHABLE_KEY: supabaseKey,
        };

        if (!config[key]) {
          throw new Error(`Missing configuration: ${key}`);
        }

        return config[key];
      }),
    };

    vi.mocked(createClient).mockReturnValue(fakeClient as never);

    service = new SupabaseService(configService as unknown as ConfigService);
  });

  it('should load configuration and create the default client', () => {
    expect(configService.getOrThrow).toHaveBeenNthCalledWith(1, 'SUPABASE_URL');

    expect(configService.getOrThrow).toHaveBeenNthCalledWith(
      2,
      'SUPABASE_PUBLISHABLE_KEY',
    );

    expect(createClient).toHaveBeenCalledWith(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    expect(service.client).toBe(fakeClient);
  });

  it('should throw when required configuration is missing', () => {
    const invalidConfigService = {
      getOrThrow: vi.fn(() => {
        throw new Error('Missing configuration: SUPABASE_URL');
      }),
    };

    expect(
      () =>
        new SupabaseService(invalidConfigService as unknown as ConfigService),
    ).toThrow('Missing configuration: SUPABASE_URL');
  });

  it('should create a user client with the provided access token', async () => {
    const accessToken = 'fake-user-access-token';

    const result = service.createUserClient(accessToken);

    expect(createClient).toHaveBeenLastCalledWith(supabaseUrl, supabaseKey, {
      accessToken: expect.any(Function),
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const options = vi.mocked(createClient).mock.calls.at(-1)?.[2];

    expect(await options?.accessToken?.()).toBe(accessToken);
    expect(result).toBe(fakeClient);
  });
});
