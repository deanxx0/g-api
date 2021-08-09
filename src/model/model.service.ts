import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModelDto } from './dto/create-model.dto';
import { ModelDocument } from './schema/model.schema';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(Model.name) private modelModel: Model<ModelDocument>,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<ModelDocument> {
    const createdModel = new this.modelModel(createModelDto);
    return createdModel.save();
  }

  async findAll(): Promise<ModelDocument[]> {
    return this.modelModel.find().exec();
  }

  async find(id: string): Promise<ModelDocument> {
    return this.modelModel.findById(id).exec();
  }

  async update(
    id: string,
    createModelDto: CreateModelDto,
  ): Promise<ModelDocument> {
    return this.modelModel
      .findByIdAndUpdate(id, { $set: { ...createModelDto } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<ModelDocument> {
    return this.modelModel.findByIdAndDelete(id).exec();
  }
}
