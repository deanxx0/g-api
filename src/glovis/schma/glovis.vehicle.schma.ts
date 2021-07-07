import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
  @Prop()
  name: String; 

  @Prop()
  vinCode: String; //차량고유번호 예:시리얼번호

  @Prop(raw({
    width: { type: Number },
    height: { type: Number },
    length: { type: Number },
    color: { type: String }
  }))
  properties: Record<string, any>;

  @Prop()
  options: String[];

  @Prop()
  createdAt: String;

  @Prop()
  updatedAt: String;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);