import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InspectionDto } from './dto/inspection.dto';
import { Inspection, InspectionDocument } from './schema/inspection.schema';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name) private inspectionModel: Model<InspectionDocument>,
  ) {}

  async findAllRecipes(): Promise<Inspection[]> {
    return this.inspectionModel.find().exec();
  }

  async findRecipe(id: string): Promise<Inspection> {
    return this.inspectionModel.findById(id).exec();
  }

  async createRecipe(inspectionDto: InspectionDto): Promise<Inspection> {
    const createdInspection = new this.inspectionModel(inspectionDto);
    return createdInspection.save();
  }

  async updateRecipe(id: string, inspectionDto: InspectionDto): Promise<Inspection> {
    return this.inspectionModel
      .findByIdAndUpdate(id, {
        $set: {
          ...inspectionDto,
        },
      })
      .exec();
  }

  async deleteRecipe(id: string) {
    this.inspectionModel.deleteOne({ _id: id }).exec();
  }
}
