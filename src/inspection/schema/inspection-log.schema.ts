import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InspectionLogDocument = InspectionLog & Document;

@Schema({ timestamps: true })
export class InspectionLog {
  @Prop()
  inspectionNo: number;

  @Prop()
  vinCode: String;

  @Prop()
  vehicleModel: String;

  @Prop()
  vehicleColor: String;

  @Prop()
  inspectionStatus: String;
}

export const InspectionLogSchema = SchemaFactory.createForClass(InspectionLog);
