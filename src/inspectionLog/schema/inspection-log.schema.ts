import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InspectionLogDocument = InspectionLog & Document;

@Schema({ timestamps: true })
export class InspectionLog {
  @Prop()
  time: string;
  
  @Prop()
  system: string;

  @Prop()
  type: string;

  @Prop()
  description: string;
}

export const InspectionLogSchema = SchemaFactory.createForClass(InspectionLog);
