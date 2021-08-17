import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TimetestDocument = Timetest & Document;

@Schema({ timestamps: true })
export class Timetest {
  @Prop({ required: true })
  num: number;
}

export const TimetestSchema = SchemaFactory.createForClass(Timetest);
