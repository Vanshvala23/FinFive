import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop()
  firstName!: string;
  @Prop()
  lastName!: string;
  @Prop()
  email!: string;
  @Prop()
  phone!: string;
  @Prop()
  service!: string;
  @Prop()
  message!: string;

  @Prop({ default: 'New' })
  status!: string;          // 'New' | 'Contacted' | 'Closed' etc.

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo!: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);