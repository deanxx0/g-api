import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop(
    raw([
      {
        name: { type: String },
        patterns: [{ distance: { type: Number }, path: { type: String } }],
      },
    ]),
  )
  lights: Record<string, any>;

  @Prop(
    raw([
      {
        name: { type: String },
        grab: { type: Array<Number>() },
        gain: [
          {
            distance: { type: Number },
            value: { type: Number },
          },
        ],
        exposureTime: [
          {
            distance: { type: Number },
            value: { type: Number },
          },
        ],
        savingOptions: {
          ok: { type: Boolean },
          ng: { type: Boolean },
          okPath: { type: String },
          ngPath: { type: String },
        },
        inferenceStretegy: {
          models: [
            {
              seg: { type: Number },
              path: { type: String },
            },
          ],
          ruleBase: { type: Array<String>() },
        },
      },
    ]),
  )
  cameras: Record<string, any>;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
