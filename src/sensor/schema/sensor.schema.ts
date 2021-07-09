import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SensorDocument = Sensor & Document;

@Schema({ timestamps: true })
export class Sensor {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  groups: string[];

  @Prop()
  status: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
