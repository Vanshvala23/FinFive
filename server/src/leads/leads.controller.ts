import {
  Controller, Get, Post, Body, Param,
  Put, Delete, UseGuards, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private service: LeadsService) {}

  // Public — submitted by website visitors (no auth required)
  @Post()
  @ApiOperation({ summary: 'Submit a new lead from the public website' })
  create(@Body() dto: CreateLeadDto) {
    return this.service.create(dto, null);
  }

  // All routes below are admin-only
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all leads (admin only)' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // NOTE: /leads/stats must stay above /leads/:id
  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead stats grouped by status (admin only)' })
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOperation({ summary: 'Get a single lead (admin only)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOperation({ summary: 'Update a lead (admin only)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateLeadDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOperation({ summary: 'Delete a lead (admin only)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}