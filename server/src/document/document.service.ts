import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument, DocumentRecord, AllowedMimeType } from './schemas/documet-schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'documents');

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(CustomerDocument.name)
    private readonly documentModel: Model<DocumentRecord>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
  ): Promise<CustomerDocument> {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMimeType)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, DOCX, and XLSX are allowed.',
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 50MB limit.');
    }

    // Generate unique stored filename
    const ext = path.extname(file.originalname);
    const storedName = `${uuidv4()}${ext}`;
    const storagePath = path.join(UPLOAD_DIR, storedName);

    // Write file to disk
    fs.writeFileSync(storagePath, file.buffer);

    const doc = new this.documentModel({
      customerId: createDocumentDto.customerId,
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      size: file.size,
      storagePath,
    });

    return doc.save();
  }

  async findAllByCustomer(customerId: string): Promise<CustomerDocument[]> {
    return this.documentModel
      .find({ customerId, isDeleted: false })
      .exec();
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const doc = await this.documentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }
    return doc;
  }

  async softDelete(id: string): Promise<void> {
    const doc = await this.documentModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }
    doc.isDeleted = true;
    await doc.save();
  }

  getFileStream(storagePath: string): fs.ReadStream {
    if (!fs.existsSync(storagePath)) {
      throw new NotFoundException('File not found on storage.');
    }
    return fs.createReadStream(storagePath);
  }
}