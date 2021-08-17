import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InspectionRecipe,
  InspectionRecipeSchema,
} from './schema/inspection-recipe.schema';
import { InspectionRecipeController } from './inspection-recipe.controller';
import { InspectionRecipeService } from './inspection-recipe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InspectionRecipe.name, schema: InspectionRecipeSchema },
    ]),
  ],
  controllers: [InspectionRecipeController],
  providers: [InspectionRecipeService],
})
export class InspectionRecipeModule {}
