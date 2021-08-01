import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FinalResult } from '../enum/final-result';

export type InspectionResultDocument = InspectionResult & Document;

@Schema({ timestamps: true })
export class InspectionResult {
  @Prop()
  inspectionId: string;

  @Prop()
  inspectionNo: number;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  elapseTime: string;

  @Prop()
  vehicleModel: String;

  @Prop()
  vehicleColor: String;

  @Prop()
  vinCode: String;

  @Prop()
  totalDefects: number;

  @Prop()
  totalSpecialDefects: number;

  @Prop()
  totalGapDefects: number;

  @Prop()
  finalResult: FinalResult;

  @Prop()
  status: String;
}

export const InspectionResultSchema =
  SchemaFactory.createForClass(InspectionResult);