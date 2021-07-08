import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InlineRecipe,
  InlineRecipeSchema,
} from './schema/inline-recipe.schema';
import { InlineRecipeController } from './inline-recipe.controller';
import { InlineRecipeService } from './inline-recipe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InlineRecipe.name, schema: InlineRecipeSchema },
    ]),
  ],
  controllers: [InlineRecipeController],
  providers: [InlineRecipeService],
})
export class InlineRecipeModule {}
