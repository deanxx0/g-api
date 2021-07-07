import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Recipe } from '../../recipe/schema/recipe.schema';

export type InlineRecipeDocument = InlineRecipe & Document;

@Schema({ timestamps: true })
export class InlineRecipe {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true })
  recipe: Recipe;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop({ required: true })
  vehicleColor: string;
}

export const InlineRecipeSchema = SchemaFactory.createForClass(InlineRecipe);
