import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('applications')
export class ApplicationsController {

  constructor(private readonly appService: ApplicationsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {

          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));

        }
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {

        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('Only PDF/DOC files allowed'), false);
        }

        cb(null, true);
      }
    })
  )

  create(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    return this.appService.create(dto, file);

  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

}