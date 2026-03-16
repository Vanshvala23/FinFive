import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

  private uploadToCloudinary(buffer: Buffer, storedName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id:     `resumes/${storedName}`,
          resource_type: 'raw',
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

  async create(
    dto: CreateApplicationDto,
    file: Express.Multer.File,
  ): Promise<Application> {
    if (!file) {
      throw new BadRequestException('Resume file is required.');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and DOCX resumes are accepted.');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('Resume must be under 5MB.');
    }

    const ext        = path.extname(file.originalname);
    const storedName = `${randomUUID()}${ext}`;
    const resumeUrl  = await this.uploadToCloudinary(file.buffer, storedName);

    const application = new this.applicationModel({
      ...dto,
      resumeUrl,
      storedName,
      originalName: file.originalname,
      mimeType:     file.mimetype,
      size:         file.size,
    });

    return application.save();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationModel.find().sort({ createdAt: -1 }).exec();
  }
}