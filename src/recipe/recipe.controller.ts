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

  @Get()
  async findAllRecipes(): Promise<Recipe[]> {
    return this.recipeService.findAllRecipes();
  }

  @Get(':id')
  async findRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.findRecipe(id);
  }

  @Post()
  async createRecipe(@Body() recipeDto: RecipeDto) {
    this.recipeService.createRecipe(recipeDto);
  }

  @Put(':id')
  async updateRecipe(@Param('id') id: string, @Body() recipeDto: RecipeDto) {
    this.recipeService.updateRecipe(id, recipeDto);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    this.recipeService.deleteRecipe(id);
  }
}
