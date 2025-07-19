import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Group } from 'src/group/schemas/group.schema';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: Types.ObjectId, ref: Group.name })
  group?: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
