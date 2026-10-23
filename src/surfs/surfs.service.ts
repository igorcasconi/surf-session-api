import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service.ts';
import { CreateSurfDto } from './dto/create-surf.dto.ts';
import { ListSurfsQueryDto } from './dto/list-surfs-query.dto.ts';

const SURF_COLUMNS = `
    id,
    peak_id,
    waves_count,
    duration_minutes,
    surfed_at,
    created_at,
    peak:peaks!surf_peak_owner_fk (
        id,
        name,
        city
    )
`

@Injectable()
export class SurfsService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async create(userId: string, accessToken: string, dto: CreateSurfDto) {
        const supabase = this.supabaseService.createUserClient(accessToken);

        const { data, error } = await supabase.from('surfs').insert({
            user_id: userId,
            peak_id: dto.peakId,
            waves_count: dto.wavesCount,
            duration_minutes: dto.durationMinutes,
            surfed_at: new Date(dto.surfedAt).toISOString()
        }).select(SURF_COLUMNS).single()

        if (error?.code === '23503') {
            throw new BadRequestException('O pico informado é inválido para este usuário!')
        }

        if (error || !data) {
            throw new InternalServerErrorException('Não foi possível registrar sua sessão de surf!');
        }

        return data;
    }

    async findAll(userId: string, accessToken: string, query: ListSurfsQueryDto) {
        const supabase = this.supabaseService.createUserClient(accessToken);

        const { limit, offset } = query;

        const { data, error } = await supabase
            .from('surfs').select(SURF_COLUMNS)
            .eq('user_id', userId)
            .order('surfed_at', { ascending: false })
            .range(offset, offset + limit);
        
        if (error) {
            throw new InternalServerErrorException('Não foi possível consultar seu histórico de surf!');
        }

        const hasMore = data.length > limit;

        return {
            data: hasMore ? data.slice(0, limit): data,
            pagination: {
                limit,
                offset,
                hasMore
            }
        }
    }

    async findOne(userId: string, accessToken: string, id: string) {
        const supabase = this.supabaseService.createUserClient(accessToken);

        const { data, error } = await supabase
            .from('surfs')
            .select(SURF_COLUMNS)
            .eq('user_id', userId)
            .eq('id', id)
            .maybeSingle()
        
        if (error) {
            throw new InternalServerErrorException('Não foi possível consultar a sessão de surf!')
        }

        if (!data) {
            throw new NotFoundException('Sessão de surf não encontrada');
        }

        return data;
    }

    async remove(userId: string, accessToken: string, id: string) {
        const supabase = this.supabaseService.createUserClient(accessToken);

        const { data, error } = await supabase
            .from('surfs')
            .delete()
            .eq('user_id', userId)
            .eq('id', id)
            .select('id')
            .maybeSingle();
        
        if (error) {
            throw new InternalServerErrorException('Não foi possível excluir a sessão de surf!');
        }

        if(!data) {
            throw new NotFoundException('Sessão de surf não encontrada');
        }

        return { message: 'Sessão de surf excluída com sucesso!'};
    }


}
