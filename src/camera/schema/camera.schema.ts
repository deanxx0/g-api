import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CameraDocument = Camera & Document;

@Schema({ timestamps: true })
export class Camera {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  groups: string[];

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

  @Prop()
  x: number;

  @Prop()
  y: number;

  @Prop()
  z: number;

  @Prop()
  resolution: number;

  @Prop()
  fov: number;

  @Prop()
  rotation: number;

  @Prop()
  flip: Boolean;

  @Prop()
  width: number;

  @Prop()
  height: number;
}

export const CameraSchema = SchemaFactory.createForClass(Camera);
