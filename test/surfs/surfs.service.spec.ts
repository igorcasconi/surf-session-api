import { CreateSurfDto } from '../../src/surfs/dto/create-surf.dto.ts';
import { SurfsService } from '../../src/surfs/surfs.service.ts';
import { SupabaseService } from '../../supabase/supabase.service.ts';

describe('SurfsService', () => {
  let service: SurfsService;
  let supabaseService: {
    createUserClient: ReturnType<typeof vi.fn>;
  };

  const createdSurf = {
    id: 'surf-123',
    peak_id: 'peak-123',
    waves_count: 10,
    duration_minutes: 90,
    surfed_at: '2026-10-28T10:00:00.000Z',
    created_at: '2026-10-28T10:05:00.000Z',
    peak: {
      id: 'peak_123',
      name: 'Itararé',
      city: 'São Vicente',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const single = vi.fn().mockResolvedValue({
      data: createdSurf,
      error: null,
    });

    const select = vi.fn().mockReturnValue({ single });

    const insert = vi.fn().mockReturnValue({ select });

    const from = vi.fn().mockReturnValue({ insert });

    supabaseService = {
      createUserClient: vi.fn().mockReturnValue({ from }),
    };

    service = new SurfsService(supabaseService as unknown as SupabaseService);
  });

  describe('create', () => {
    it('should create a surf session successfully', async () => {
      const userId = 'user-123';
      const accessToken = 'fake-access-token';

      const dto = {
        peakId: 'peak-123',
        wavesCount: 10,
        durationMinutes: 90,
        surfedAt: '2026-10-28T10:00:00.000Z',
      } as CreateSurfDto;

      const result = await service.create(userId, accessToken, dto);

      expect(supabaseService.createUserClient).toHaveBeenCalledWith(
        accessToken,
      );

      const supabase = supabaseService.createUserClient.mock.results[0].value;

      expect(supabase.from).toHaveBeenCalledWith('surfs');

      expect(supabase.from().insert).toHaveBeenCalledWith({
        user_id: userId,
        peak_id: dto.peakId,
        waves_count: dto.wavesCount,
        duration_minutes: dto.durationMinutes,
        surfed_at: new Date(dto.surfedAt).toISOString(),
      });

      expect(result).toEqual(createdSurf);
    });
  });

  it('should throw BadRequestException when the peak is invalid', async () => {
    const dto = {
      peakId: 'invalid-peak',
      wavesCount: 10,
      durationMinutes: 90,
      surfedAt: '2026-10-28T10:00:00.000Z',
    } as CreateSurfDto;

    const single = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: '23503',
      },
    });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    supabaseService.createUserClient.mockReturnValue({ from });
    await expect(
      service.create('user-123', 'fake-access-token', dto),
    ).rejects.toThrow('O pico informado é inválido para este usuário');
  });

  it('should throw InternalServerErrorException when Supabase returns an error', async () => {
    const dto = {
      peakId: 'peak-123',
      wavesCount: 10,
      durationMinutes: 90,
      surfedAt: '2026-10-28T10:00:00.000Z',
    } as CreateSurfDto;

    const single = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: '500',
        message: 'Database connection failed',
      },
    });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    supabaseService.createUserClient.mockReturnValue({ from });
    await expect(
      service.create('user-123', 'fake-access-token', dto),
    ).rejects.toThrow('Não foi possível registrar sua sessão de surf!');
  });

  it('should throw InternalServerErrorException when no data is returned', async () => {
    const dto = {
      peakId: 'peak-123',
      wavesCount: 10,
      durationMinutes: 90,
      surfedAt: '2026-10-28T10:00:00.000Z',
    } as CreateSurfDto;

    const single = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    supabaseService.createUserClient.mockReturnValue({ from });
    await expect(
      service.create('user-123', 'fake-access-token', dto),
    ).rejects.toThrow('Não foi possível registrar sua sessão de surf!');
  });

  describe('findOne', () => {
    it('should return a surf session when it exists', async () => {
      const surf = {
        id: 'surf-123',
        peak_id: 'peak-123',
        waves_count: 10,
        duration_minutes: 90,
        surfed_at: '2026-10-28T10:00:00.000Z',
        created_at: '2026-10-28T10:05:00.000Z',
        peak: {
          id: 'peak-123',
          name: 'Itararé',
          city: 'São Vicente',
        },
      };

      const maybeSingle = vi.fn().mockResolvedValue({
        data: surf,
        error: null,
      });

      const secondEq = vi.fn().mockReturnValue({ maybeSingle });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const select = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ select });

      supabaseService.createUserClient.mockReturnValue({ from });

      const result = await service.findOne(
        'user-123',
        'fake-access-token',
        'surf-123',
      );

      expect(supabaseService.createUserClient).toHaveBeenCalledWith(
        'fake-access-token',
      );
      expect(from).toHaveBeenCalledWith('surfs');
      expect(select).toHaveBeenCalledWith(expect.stringContaining('peak_id'));

      expect(firstEq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(secondEq).toHaveBeenCalledWith('id', 'surf-123');

      expect(result).toEqual(surf);
    });

    it('should throw NotFoundException when the surf session does not exist', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const secondEq = vi.fn().mockReturnValue({ maybeSingle });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const select = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ select });

      supabaseService.createUserClient.mockReturnValue({ from });

      await expect(
        service.findOne('user-123', 'fake-access-token', 'nonexistent-surf'),
      ).rejects.toThrow('Sessão de surf não encontrada');
    });

    it('should throw InternalServerErrorException when Supabase returns an error', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: {
          code: '500',
          message: 'Database connection failed',
        },
      });

      const secondEq = vi.fn().mockReturnValue({ maybeSingle });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const select = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ select });

      supabaseService.createUserClient.mockReturnValue({ from });

      await expect(
        service.findOne('user-123', 'fake-access-token', 'surf-123'),
      ).rejects.toThrow('Não foi possível consultar a sessão de surf!');
    });
  });

  describe('remove', () => {
    it('should delete a surf session successfully', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: { id: 'surf-123' },
        error: null,
      });

      const select = vi.fn().mockReturnValue({ maybeSingle });
      const secondEq = vi.fn().mockReturnValue({ select });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const deleteFn = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ delete: deleteFn });

      supabaseService.createUserClient.mockReturnValue({ from });

      const result = await service.remove(
        'user-123',
        'fake-access-token',
        'surf-123',
      );

      expect(supabaseService.createUserClient).toHaveBeenCalledWith(
        'fake-access-token',
      );

      expect(from).toHaveBeenCalledWith('surfs');
      expect(deleteFn).toHaveBeenCalled();
      expect(firstEq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(result).toEqual({
        message: 'Sessão de surf excluída com sucesso!',
      });
    });

    it('should throw NotFoundException when remove the surf session does not exist', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const select = vi.fn().mockReturnValue({ maybeSingle });
      const secondEq = vi.fn().mockReturnValue({ select });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const deleteFn = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ delete: deleteFn });

      supabaseService.createUserClient.mockReturnValue({ from });

      await expect(
        service.remove('user-123', 'fake-access-token', 'nonexistent-surf'),
      ).rejects.toThrow('Sessão de surf não encontrada');
    });

    it('should throw InternalServerErrorException when Supabase returns an error', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: {
          code: '500',
          message: 'Database connection failed',
        },
      });

      const select = vi.fn().mockReturnValue({ maybeSingle });
      const secondEq = vi.fn().mockReturnValue({ select });
      const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
      const deleteFn = vi.fn().mockReturnValue({ eq: firstEq });
      const from = vi.fn().mockReturnValue({ delete: deleteFn });

      supabaseService.createUserClient.mockReturnValue({ from });

      await expect(
        service.remove('user-123', 'fake-access-token', 'surf-123'),
      ).rejects.toThrow('Não foi possível excluir a sessão de surf!');
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';
    const accessToken = 'fake-access-token';

    const createSurf = (id: string) => ({
      id,
      peak_id: 'peak-123',
      waves_count: 10,
      duration_minutes: 90,
      surfed_at: '2026-10-28T10:00:00.000Z',
      created_at: '2026-10-28T10:05:00.000Z',
      peak: {
        id: 'peak-123',
        name: 'Itararé',
        city: 'São Vicente',
      },
    });

    function mockFindAllResponse(data: unknown, error: unknown = null) {
      const range = vi.fn().mockResolvedValue({ data, error });
      const order = vi.fn().mockReturnValue({ range });
      const eq = vi.fn().mockReturnValue({ order });
      const select = vi.fn().mockReturnValue({ eq });
      const from = vi.fn().mockReturnValue({ select });

      supabaseService.createUserClient.mockReturnValue({ from });

      return { from, select, eq, order, range };
    }

    it('should return a surf session when it exists', async () => {
      const data = [
        createSurf('surf-1'),
        createSurf('surf-2'),
        createSurf('surf-3'),
      ];

      const maybeSingle = vi.fn().mockResolvedValue({
        data: data,
        error: null,
      });

      const mocks = mockFindAllResponse(data);
      const query = { limit: 2, offset: 0 };

      const result = await service.findAll(userId, accessToken, query);

      expect(mocks.from).toHaveBeenCalledWith('surfs');
      expect(mocks.eq).toHaveBeenCalledWith('user_id', userId);
      expect(mocks.order).toHaveBeenCalledWith('surfed_at', {
        ascending: false,
      });
      expect(mocks.range).toHaveBeenCalledWith(0, 2);

      expect(result).toEqual({
        data: data.slice(0, 2),
        pagination: { limit: 2, offset: 0, hasMore: true },
      });
    });

    it('should return all records when there are no additional results', async () => {
      const data = [createSurf('surf-1'), createSurf('surf-2')];

      mockFindAllResponse(data);
      const query = { limit: 2, offset: 2 };

      const result = await service.findAll(userId, accessToken, query);

      expect(result).toEqual({
        data,
        pagination: { limit: 2, offset: 2, hasMore: false },
      });
    });

    it('should throw InternalServerErrorException when Supabase returns an error', async () => {
      mockFindAllResponse(null, {
        code: '500',
        message: 'Database connection failed',
      });
      const query = { limit: 10, offset: 0 };

      expect(service.findAll(userId, accessToken, query)).rejects.toThrow(
        'Não foi possível consultar seu histórico de surf!',
      );
    });
  });
});
