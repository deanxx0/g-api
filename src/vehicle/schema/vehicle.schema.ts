import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop()
  name: String;

  @Prop()
  vinCode: String;

  @Prop()
  vinNumber: String;

  @Prop(
    raw({
      width: { type: Number },
      height: { type: Number },
      length: { type: Number },
      model: { type: String },
      color: { type: String },
      detailColor: { type: String },
    }),
  )
  properties: Record<string, any>;

  @Prop()
  options: String[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
