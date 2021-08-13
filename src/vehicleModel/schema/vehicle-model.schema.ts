import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VehicleModelDocument = VehicleModel & Document;

@Schema({ timestamps: true })
export class VehicleModel {
  @Prop()
  model: String;
}

export const VehicleModelSchema = SchemaFactory.createForClass(VehicleModel);
