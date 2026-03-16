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

  @Prop({ required: true, trim: true })
  originalName!: string;

  @Prop({ required: true, trim: true })
  storedName!: string;

  @Prop({ required: true })
  mimeType!: AllowedMimeType;

  @Prop({ required: true, type: Number })
  size!: number; // in bytes

  @Prop({ required: true, trim: true })
  storagePath!: string;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const CustomerDocumentSchema = SchemaFactory.createForClass(CustomerDocument);