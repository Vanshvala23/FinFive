import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type{ Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    if (!file) throw new BadRequestException('File required');
    return this.documentService.upload(file, dto);
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') id: string) {
    return this.documentService.findAllByCustomer(id);
  }

  // 🔥 FINAL DOWNLOAD
@Get(':id/download')
async download(@Param('id') id: string, @Res() res: Response) {
  const doc = await this.documentService.findOne(id);

  try {
    const url = this.documentService.getDownloadUrl(doc.publicId);
    return res.redirect(url);
  } catch (e) {
    throw new NotFoundException('File not available (deleted or corrupted)');
  }
}

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}