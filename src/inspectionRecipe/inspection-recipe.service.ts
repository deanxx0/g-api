import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInspectionRecipeDto } from './dto/create-inspection-recipe.dto';
import { InspectionRecipe, InspectionRecipeDocument } from './schema/inspection-recipe.schema';

@Injectable()
export class InspectionRecipeService {
  constructor(
    @InjectModel(InspectionRecipe.name) private inspectionRecipeModel: Model<InspectionRecipeDocument>,
  ) {}

  async create(createInspectionRecipeDto: CreateInspectionRecipeDto): Promise<InspectionRecipeDocument> {
    const createdSensor = new this.inspectionRecipeModel(createInspectionRecipeDto);
    return createdSensor.save();
  }

  async findAll(): Promise<InspectionRecipeDocument[]> {
    return this.inspectionRecipeModel.find().exec();
  }

  async find(id: string): Promise<InspectionRecipeDocument> {
    return this.inspectionRecipeModel.findById(id).exec();
  }

  async delete(id: string): Promise<InspectionRecipeDocument> {
    return this.inspectionRecipeModel.findByIdAndDelete(id).exec();
  }
}
