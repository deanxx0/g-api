import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Recipe } from 'src/recipe/schema/recipe.schema';
import { Vehicle } from 'src/vehicle/schema/vehicle.schema';

export type InspectionDocument = Inspection & Document;

@Schema({ timestamps: true })
export class Inspection {
  @Prop()
  inspectionNo: number;

  @Prop()
  vehicle: Vehicle;

  @Prop()
  recipe: Recipe;

  @Prop()
  status: string;

  // @Prop(
  //   raw([
  //     {
  //       camera: { type: String },
  //       grab: {
  //         seq: { type: Number },
  //         distance: { type: Number },
  //       },
  //       defects: [
  //         {
  //           x: { type: Number },
  //           y: { type: Number },
  //           width: { type: Number },
  //           height: { type: Number },
  //           code: { type: Number },
  //         },
  //       ],
  //     },
  //   ]),
  // )
  // inferenceResults: Record<string, any>;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
