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
import { randomUUID } from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(CustomerDocument.name)
    private readonly documentModel: Model<DocumentRecord>,
  ) {}

  private uploadToCloudinary(
    buffer: Buffer,
    storedName: string,
    mimeType: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `documents/${storedName}`,
          resource_type: 'raw',
          format: mimeType.split('/')[1],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      );
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async upload(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
  ): Promise<CustomerDocument> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMimeType)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, DOCX, and XLSX are allowed.',
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 50MB limit.');
    }

    const ext = path.extname(file.originalname);
    const storedName = `${randomUUID()}${ext}`;
    const storageUrl = await this.uploadToCloudinary(file.buffer, storedName, file.mimetype);

    const doc = new this.documentModel({
      customerId:   createDocumentDto.customerId,
      originalName: file.originalname,
      storedName,
      mimeType:     file.mimetype,
      size:         file.size,
      storagePath:  storageUrl,
    });

    return doc.save();
  }

  // Returns every non-deleted document — used by the admin vault view
  async findAll(): Promise<CustomerDocument[]> {
    return this.documentModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findAllByCustomer(customerId: string): Promise<CustomerDocument[]> {
    return this.documentModel.find({ customerId, isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const doc = await this.documentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!doc) throw new NotFoundException(`Document with ID ${id} not found.`);
    return doc;
  }

  async softDelete(id: string): Promise<void> {
    const doc = await this.documentModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Document with ID ${id} not found.`);

    const publicId = `documents/${doc.storedName.replace(/\.[^/.]+$/, '')}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    doc.isDeleted = true;
    await doc.save();
  }

  getDownloadUrl(storagePath: string): string {
    if (!storagePath) throw new NotFoundException('File URL not found.');
    return storagePath;
  }
}