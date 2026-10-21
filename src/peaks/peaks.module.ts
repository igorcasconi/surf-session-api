import { Module } from '@nestjs/common';
import { PeaksController } from './peaks.controller.js';
import { PeaksService } from './peaks.service.js';
import { SupabaseModule } from '../../supabase/supabase.module.ts';
import { AuthGuard } from '../auth/guards/auth.guard.ts';

@Module({
  imports: [SupabaseModule],
  controllers: [PeaksController],
  providers: [PeaksService, AuthGuard],
})
export class PeaksModule {}
