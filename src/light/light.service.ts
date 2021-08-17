import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Light, LightDocument } from './schema/light.schema';
import { CreateLightDto } from './dto/create-light.dto';

@Injectable()
export class LightService {
  constructor(
    @InjectModel(Light.name) private lightModel: Model<LightDocument>,
  ) {}

  async create(createLightDto: CreateLightDto): Promise<LightDocument> {
    const createdLight = new this.lightModel(createLightDto);
    return createdLight.save();
  }

  async findAll(): Promise<LightDocument[]> {
    return this.lightModel.find().exec();
  }

  async find(id: string): Promise<LightDocument> {
    return this.lightModel.findById(id).exec();
  }

  async update(
    id: string,
    createLightDto: CreateLightDto,
  ): Promise<LightDocument> {
    return this.lightModel
      .findByIdAndUpdate(id, { $set: { ...createLightDto } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<LightDocument> {
    return this.lightModel.findByIdAndDelete(id).exec();
  }
}
