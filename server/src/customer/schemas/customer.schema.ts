import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true })
  corporateEntityName: string;

  @Prop({ required: true, trim: true })
  keyContactPerson: string;

  @Prop({ required: true, type: Number, min: 0 })
  initialAUM: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);