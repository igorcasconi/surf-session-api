import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service.ts';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}