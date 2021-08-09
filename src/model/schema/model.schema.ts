import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ModelDocument = Model & Document;

@Schema({ timestamps: true })
export class Model {
  @Prop({ required: true })
  model: String;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
