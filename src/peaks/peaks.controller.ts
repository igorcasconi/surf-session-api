import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as authGuard from '../auth/guards/auth.guard.ts';
import { PeaksService } from './peaks.service.ts';
import { CreatePeakDto } from './dto/create-peak.dto.ts';
import { UpdatePeakDto } from './dto/update-peak.dto.ts';

@Controller('peaks')
@UseGuards(authGuard.AuthGuard)
export class PeaksController {
  constructor(private readonly peaksService: PeaksService) {}

  @Post()
  create(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body() dto: CreatePeakDto,
  ) {
    return this.peaksService.create(request.user.id, request.accessToken, dto);
  }

  @Get()
  findAll(@Req() request: authGuard.AuthenticatedRequest) {
    return this.peaksService.findAll(request.user.id, request.accessToken);
  }

  @Patch(':id')
  update(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePeakDto,
  ) {
    return this.peaksService.update(
      request.user.id,
      request.accessToken,
      dto,
      id,
    );
  }

  @Delete(':id')
  remove(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.peaksService.remove(request.user.id, request.accessToken, id);
  }
}
