import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.js';
import { envSchema } from './config/env.schema.ts';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.ts';
import { PeaksModule } from './peaks/peaks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    AuthModule,
    PeaksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
