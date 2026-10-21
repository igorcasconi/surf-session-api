import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service.ts';
import { CreatePeakDto } from './dto/create-peak.dto.ts';
import { UpdatePeakDto } from './dto/update-peak.dto.ts';

@Injectable()
export class PeaksService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(userId: string, accessToken: string, dto: CreatePeakDto) {
    const supabase = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await supabase
      .from('peaks')
      .insert({
        user_id: userId,
        name: dto.name.trim(),
        city: dto.city?.trim() || null,
      })
      .select('id, name, city, created_at')
      .single();

    if (error?.code === '23505') {
      throw new ConflictException('Você já cadastrou um pico com esse nome!');
    }

    if (error || !data) {
      throw new InternalServerErrorException(
        'Não foi possível criar esse pico!',
      );
    }

    return data;
  }

  async findAll(userId: string, accessToken: string) {
    const supabase = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await supabase
      .from('peaks')
      .select('id, name, city, created_at')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível listar os picos!',
      );
    }

    return data;
  }

  async update(
    userId: string,
    accessToken: string,
    dto: UpdatePeakDto,
    id: string,
  ) {
    if (Object.keys(dto).length === 0) {
      throw new ConflictException(
        'Informe pelo menos um campo para atualizar!',
      );
    }

    const supabase = this.supabaseService.createUserClient(accessToken);
    const updates: { name?: string; city?: string | null } = {};

    if (dto.name !== undefined) {
      updates.name = dto.name.trim();
    }

    if (dto.city !== undefined) {
      updates.city = dto.city?.trim() || null;
    }

    const { data, error } = await supabase
      .from('peaks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, city, name, created_at')
      .maybeSingle();

    if (error?.code === '23505') {
      throw new ConflictException('Você já possui outro pico com esse nome!');
    }

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar o pico!',
      );
    }

    if (!data) {
      throw new NotFoundException('Pico não encontrado!');
    }

    return data;
  }

  async remove(userId: string, accessToken: string, id: string) {
    const supabase = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await supabase
      .from('peaks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, name, city, created_at')
      .maybeSingle();

    if (error?.code === '23503') {
      throw new ConflictException(
        'Não é possível excluir pico que já possui sessões de surf!',
      );
    }

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível remover o pico!',
      );
    }

    if (!data) {
      throw new NotFoundException('Pico não encontrado!');
    }

    return { message: 'Pico excluído com sucesso!' };
  }
}
