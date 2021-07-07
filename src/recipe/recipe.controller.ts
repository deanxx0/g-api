import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { RecipeDto } from './dto/recipe.dto';
import { RecipeService } from './recipe.service';
import { Recipe } from './schema/recipe.schema';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Get('recipes')
  async findAllRecipes(): Promise<Recipe[]> {
    return this.recipeService.findAllRecipes();
  }

  @Get('recipe/:id')
  async findRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.findRecipe(id);
  }

  @Post('recipe')
  async createRecipe(@Body() recipeDto: RecipeDto) {
    this.recipeService.createRecipe(recipeDto);
  }

  @Put('recipe/:id')
  async updateRecipe(@Param('id') id: string, @Body() recipeDto: RecipeDto) {
    this.recipeService.updateRecipe(id, recipeDto);
  }

  @Delete('recipe/:id')
  async deleteRecipe(@Param('id') id: string) {
    this.recipeService.deleteRecipe(id);
  }
}
