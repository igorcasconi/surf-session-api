import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SurfsService } from './surfs.service.ts';
import * as authGuard from '../auth/guards/auth.guard.ts';
import { CreateSurfDto } from './dto/create-surf.dto.ts';
import { ListSurfsQueryDto } from './dto/list-surfs-query.dto.ts';

@Controller('surfs')
@UseGuards(authGuard.AuthGuard)
export class SurfsController {
    constructor(private readonly surfService: SurfsService){}

    @Post()
    create(@Req() request: authGuard.AuthenticatedRequest, @Body() dto: CreateSurfDto) {
        return this.surfService.create(request.user.id, request.accessToken, dto);
    }

    @Get()
    findAll(@Req() request: authGuard.AuthenticatedRequest, @Query() query: ListSurfsQueryDto) {
        return this.surfService.findAll(request.user.id, request.accessToken, query);
    }

    @Get(':id')
    findOne(@Req() request: authGuard.AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
        return this.surfService.findOne(request.user.id, request.accessToken, id);
    }

    @Delete(':id')
    remove(@Req() request: authGuard.AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
        return this.surfService.remove(request.user.id, request.accessToken, id);
    }
}
