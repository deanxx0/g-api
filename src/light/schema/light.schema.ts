import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LightDocument = Light & Document;

@Schema({ timestamps: true })
export class Light {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  group: string[];

  @Prop()
  status: string;

  @Prop()
  workingFolderPath: string;

  @Prop()
  serverIp: string;
}

export const LightSchema = SchemaFactory.createForClass(Light);
