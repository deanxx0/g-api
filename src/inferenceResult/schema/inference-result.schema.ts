import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InferenceResultDocument = InferenceResult & Document;

@Schema({ timestamps: true })
export class InferenceResult {
  @Prop({ required: true })
  inspectionId: string;

  @Prop()
  inspectionNo: number;

  @Prop()
  camera: string;

  @Prop()
  cameraName: string;

  @Prop(
    raw({
      seq: { type: Number },
      distance: { type: Number },
    }),
  )
  grab: Record<string, any>;

  @Prop(
    raw([
      {
        x: { type: Number },
        y: { type: Number },
        width: { type: Number },
        height: { type: Number },
        code: { type: Number },
      },
    ]),
  )
  defects: Record<string, any>;
}

export const InferenceResultSchema =
  SchemaFactory.createForClass(InferenceResult);
