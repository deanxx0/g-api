import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VehicleColorDocument = VehicleColor & Document;

@Schema({ timestamps: true })
export class VehicleColor {
  @Prop({ required: true })
  color: String;
}

export const VehicleColorSchema = SchemaFactory.createForClass(VehicleColor);
