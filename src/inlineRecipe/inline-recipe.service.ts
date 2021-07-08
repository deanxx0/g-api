import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InlineRecipe,
  InlineRecipeDocument,
} from './schema/inline-recipe.schema';
import { CreateInlineRecipeDto } from './dto/create-inline-recipe.dto';

@Injectable()
export class InlineRecipeService {
  constructor(
    @InjectModel(InlineRecipe.name)
    private inlineRecipeModel: Model<InlineRecipeDocument>,
  ) {}

  async create(
    createInlineRecipeDto: CreateInlineRecipeDto,
  ): Promise<InlineRecipeDocument> {
    const createdInlineRecipe = new this.inlineRecipeModel(
      createInlineRecipeDto,
    );
    return createdInlineRecipe.save();
  }

  async findAll(): Promise<InlineRecipeDocument[]> {
    return this.inlineRecipeModel.find().exec();
  }

  async find(id: string): Promise<InlineRecipeDocument> {
    return this.inlineRecipeModel.findById(id).exec();
  }

  async findByVehicle(
    model: string,
    color: string,
  ): Promise<InlineRecipeDocument> {
    return this.inlineRecipeModel
      .findOne({ vehicleModel: model, vehicleColor: color })
      .populate('recipe')
      .exec();
  }

  async update(
    id: string,
    createInlineRecipeDto: CreateInlineRecipeDto,
  ): Promise<InlineRecipeDocument> {
    return this.inlineRecipeModel
      .findByIdAndUpdate(
        id,
        { $set: { ...createInlineRecipeDto } },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<InlineRecipeDocument> {
    return this.inlineRecipeModel.findByIdAndDelete(id).exec();
  }
}
