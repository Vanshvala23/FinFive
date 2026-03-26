import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type DocumentRecord = CustomerDocument & MongooseDocument;

export type AllowedMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Schema({ timestamps: true })
export class CustomerDocument {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true })
  storedName!: string;

  @Prop({ required: true })
  mimeType!: AllowedMimeType;

  @Prop({ required: true })
  size!: number;

  @Prop({ required: true })
  storagePath!: string;

  // 🔥 CRITICAL FIELD
  @Prop({ required: true })
  publicId!: string;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const CustomerDocumentSchema = SchemaFactory.createForClass(CustomerDocument);