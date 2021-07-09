import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema({ timestamps: true })
export class Recipe {
  @Prop()
  name: string;

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
        grabs: { type: Array<Number>() },
        gains: [
          {
            distance: { type: Number },
            value: { type: Number },
          },
        ],
        exposureTimes: [
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
              seq: { type: Number },
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
