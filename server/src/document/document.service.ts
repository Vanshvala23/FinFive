import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CustomerDocument,
  DocumentRecord,
  AllowedMimeType,
} from './schemas/documet-schema';
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

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

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

  // ✅ Upload to Cloudinary
  private uploadToCloudinary(
    buffer: Buffer,
    fileId: string,
  ): Promise<{ publicId: string; url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `documents/${fileId}`,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error || !result) return reject(error);

          const publicId = result.public_id;

          const url = cloudinary.url(publicId, {
            resource_type: 'raw',
            secure: true,
          });

          resolve({ publicId, url });
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
    dto: CreateDocumentDto,
  ): Promise<CustomerDocument> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMimeType)) {
      throw new BadRequestException('Only PDF, DOCX, XLSX allowed');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('Max file size is 50MB');
    }

    const fileId = randomUUID();
    const ext = path.extname(file.originalname);
    const storedName = `${fileId}${ext}`;

    const { publicId, url } = await this.uploadToCloudinary(
      file.buffer,
      fileId,
    );

    const doc = new this.documentModel({
      customerId: dto.customerId,
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: url,
      publicId, // 🔥 MUST SAVE
    });

    return doc.save();
  }

  async findAll() {
    return this.documentModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });
  }

  async findAllByCustomer(customerId: string) {
    return this.documentModel.find({
      customerId,
      isDeleted: false,
    });
  }

  async findOne(id: string) {
    const doc = await this.documentModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async softDelete(id: string) {
    const doc = await this.documentModel.findById(id);
    if (!doc) throw new NotFoundException('Document not found');

    await cloudinary.uploader.destroy(doc.publicId, {
      resource_type: 'raw',
    });

    doc.isDeleted = true;
    await doc.save();
  }

  // ✅ Always generate correct download URL
  getDownloadUrl(publicId: string) {
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      flags: 'attachment',
    });
  }
}