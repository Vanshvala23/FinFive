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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

const MULTER_OPTIONS = {
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
};

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // ✅ UPLOAD
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  @ApiOperation({ summary: 'Upload document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        customerId: { type: 'string' },
      },
      required: ['file', 'customerId'],
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.documentService.upload(file, createDocumentDto);
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  // ✅ GET BY CUSTOMER
  @Get('customer/:customerId')
  findAllByCustomer(@Param('customerId') customerId: string) {
    return this.documentService.findAllByCustomer(customerId);
  }

  // 🔥🔥🔥 FIXED DOWNLOAD (CRITICAL)
  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const doc = await this.documentService.findOne(id);

    // ✅ Force download
    const downloadUrl = `${doc.storagePath}?fl_attachment=true`;

    return res.redirect(downloadUrl);
  }

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  // ✅ DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  softDelete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}