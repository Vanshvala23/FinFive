import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

const MULTER_OPTIONS = {
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
};

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // POST /documents/upload
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }
    return this.documentService.upload(file, createDocumentDto);
  }

  // GET /documents/customer/:customerId
  @Get('customer/:customerId')
  findAllByCustomer(@Param('customerId') customerId: string) {
    return this.documentService.findAllByCustomer(customerId);
  }

  // GET /documents/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  // GET /documents/:id/download  →  redirects to Cloudinary URL
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.documentService.findOne(id);
    const url = this.documentService.getDownloadUrl(doc.storagePath);
    return res.redirect(url);
  }

  // DELETE /documents/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  softDelete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}