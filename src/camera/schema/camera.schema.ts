import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CameraDocument = Camera & Document;

@Schema({ timestamps: true })
export class Camera {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  group: string[];

  @Prop()
  status: string;

  @Prop({ required: true })
  serial: string;

  @Prop()
  workingFolderPath: string;

  @Prop()
  type: string;

  @Prop()
  ip: string;

  @Prop()
  nicIp: string;

  @Prop()
  serverIp: string;
}

export const CameraSchema = SchemaFactory.createForClass(Camera);
