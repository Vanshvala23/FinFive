import {
  Controller, Get, Post, Body, Param,
  Put, Delete, UseGuards, Request, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('leads')
export class LeadsController {
  constructor(private service: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto, @Request() req) {
    return this.service.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // NOTE: /leads/stats must be declared BEFORE /leads/:id
  // so Express doesn't treat "stats" as a Mongo ObjectId param.
  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateLeadDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}