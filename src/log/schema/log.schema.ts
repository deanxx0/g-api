import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  system: string;

  @Prop()
  type: string;

  @Prop()
  description: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
