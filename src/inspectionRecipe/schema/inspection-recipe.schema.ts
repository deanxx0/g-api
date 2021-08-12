import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InspectionRecipeDocument = InspectionRecipe & Document;

@Schema({ timestamps: true })
export class InspectionRecipe {
  @Prop({ required: true })
  name: string;

  @Prop()
  size: Number;

  @Prop()
  area: Number;

  @Prop()
  limitCountByImage: Number;

  @Prop()
  limitCountByVehicle: Number;

  @Prop()
  gap: Number;

  @Prop()
  differenceColor: Number;
}

export const InspectionRecipeSchema =
  SchemaFactory.createForClass(InspectionRecipe);
