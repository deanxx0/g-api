import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeDto } from './dto/recipe.dto';
import { Recipe, RecipeDocument } from './schema/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findAllRecipes(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findRecipe(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).exec();
  }

  async createRecipe(recipeDto: RecipeDto): Promise<Recipe> {
    const createdRecipe = new this.recipeModel(recipeDto);
    return createdRecipe.save();
  }

  async updateRecipe(id: string, recipeDto: RecipeDto): Promise<Recipe> {
    return this.recipeModel
      .findByIdAndUpdate(id, {
        $set: {
          ...recipeDto,
        },
      })
      .exec();
  }

  async deleteRecipe(id: string) {
    this.recipeModel.deleteOne({ _id: id }).exec();
  }
}
