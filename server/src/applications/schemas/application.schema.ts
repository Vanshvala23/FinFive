import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  highestEducationQualification: string;

  @Prop()
  streetAddress: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop({ required: true })
  country: string;

  // Cloudinary resume URL
  @Prop({ required: true })
  resumeUrl: string;

  // Stored filename
  @Prop()
  storedName: string;

  // Original filename
  @Prop()
  originalName: string;

  // File type
  @Prop()
  mimeType: string;

  // File size
  @Prop()
  size: number;

}

export const ApplicationSchema = SchemaFactory.createForClass(Application);