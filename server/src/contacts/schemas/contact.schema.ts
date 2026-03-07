import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
    @Prop({required:true})
    name:string;
    @Prop({required:true})
    email:string;
    @Prop({required:true})
    phone:string;
    @Prop({required:true})
    company:string;
    @Prop({required:true})
    //frontend has drop down for services
    service:string;
    @Prop({required:true})
    message:string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);