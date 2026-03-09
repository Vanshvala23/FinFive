import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import * as path from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

@Injectable()
export class ApplicationsService {

  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

  private uploadToCloudinary(
    buffer: Buffer,
    storedName: string,
    mimeType: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `applications/${storedName}`,
          resource_type: 'raw',
          format: mimeType.split('/')[1],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);

    });
  }

  async create(
    dto: CreateApplicationDto,
    file: Express.Multer.File,
  ): Promise<Application> {

    if (!file) {
      throw new BadRequestException('Resume file is required.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF and DOCX resumes allowed.',
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        'Resume exceeds the 5MB limit.',
      );
    }

    const ext = path.extname(file.originalname);
    const storedName = `${randomUUID()}${ext}`;

    const resumeUrl = await this.uploadToCloudinary(
      file.buffer,
      storedName,
      file.mimetype,
    );

    const application = new this.applicationModel({
      ...dto,
      resumeUrl,
      storedName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    return application.save();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }
}