import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import type { Express } from 'express';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Public — job seekers submit this without an account
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Submit a job application with resume' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['resume', 'firstName', 'lastName', 'email', 'phoneNumber',
                 'highestEducationQualification', 'city', 'country'],
      properties: {
        resume:                        { type: 'string', format: 'binary' },
        firstName:                     { type: 'string', example: 'Jane' },
        lastName:                      { type: 'string', example: 'Doe' },
        email:                         { type: 'string', example: 'jane@email.com' },
        phoneNumber:                   { type: 'string', example: '+91 98765 43210' },
        highestEducationQualification: { type: 'string', example: 'B.Com' },
        streetAddress:                 { type: 'string', example: '42 MG Road' },
        city:                          { type: 'string', example: 'Mumbai' },
        state:                         { type: 'string', example: 'Maharashtra' },
        zipCode:                       { type: 'string', example: '400001' },
        country:                       { type: 'string', example: 'India' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Application submitted.' })
  @ApiResponse({ status: 400, description: 'Validation failed or invalid file.' })
  create(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Resume file is required.');
    return this.applicationsService.create(dto, file);
  }

  // Admin-only — protected by JWT
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all job applications (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all applications.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.applicationsService.findAll();
  }
}