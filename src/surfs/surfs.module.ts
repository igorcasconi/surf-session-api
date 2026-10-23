import { Module } from '@nestjs/common';
import { SurfsController } from './surfs.controller.js';
import { SurfsService } from './surfs.service.js';
import { SupabaseModule } from '../../supabase/supabase.module.ts';
import { AuthGuard } from '../auth/guards/auth.guard.ts';

@Module({
  imports: [SupabaseModule],
  controllers: [SurfsController],
  providers: [SurfsService, AuthGuard]
})
export class SurfsModule {}
