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

  // POST /documents/upload
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  @ApiOperation({ summary: 'Upload a document to the vault' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file:         { type: 'string', format: 'binary' },
        customerId:   { type: 'string', example: '664f1b2c8e4a2b001e3d9a11' },
        originalName: { type: 'string', example: 'Q3_Report.pdf' },
      },
      required: ['file', 'customerId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded.' })
  @ApiResponse({ status: 400, description: 'Invalid file or missing fields.' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) throw new BadRequestException('No file provided.');
    return this.documentService.upload(file, createDocumentDto);
  }

  // GET /documents  ← was missing; admin dashboard calls this
  @Get()
  @ApiOperation({ summary: 'Get all documents (admin vault view)' })
  @ApiResponse({ status: 200, description: 'Returns all non-deleted documents.' })
  findAll() {
    return this.documentService.findAll();
  }

  // GET /documents/customer/:customerId
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all documents for a specific customer' })
  @ApiParam({ name: 'customerId', description: 'MongoDB ObjectId of the customer' })
  @ApiResponse({ status: 200, description: 'Returns documents for the customer.' })
  findAllByCustomer(@Param('customerId') customerId: string) {
    return this.documentService.findAllByCustomer(customerId);
  }

  // GET /documents/:id/download  — must come before /:id to avoid route collision
  @Get(':id/download')
  @ApiOperation({ summary: 'Redirect to Cloudinary download URL' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the document' })
  @ApiResponse({ status: 302, description: 'Redirects to the file URL.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.documentService.findOne(id);
    const url = this.documentService.getDownloadUrl(doc.storagePath);
    return res.redirect(url);
  }

  // GET /documents/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single document by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the document' })
  @ApiResponse({ status: 200, description: 'Returns the document record.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  // DELETE /documents/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a document and remove from Cloudinary' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the document' })
  @ApiResponse({ status: 204, description: 'Document deleted.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  softDelete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}