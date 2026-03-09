import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: false })
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

  @Prop({ required: true })
  resume: string; // file path

}

export const ApplicationSchema = SchemaFactory.createForClass(Application);