import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import {
  VehicleModel,
  VehicleModelDocument,
} from './schema/vehicle-model.schema';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectModel(VehicleModel.name)
    private vehicleModelModel: Model<VehicleModelDocument>,
  ) {}

  async create(
    createVehicleModelDto: CreateVehicleModelDto,
  ): Promise<VehicleModelDocument> {
    const createdVehicleModel = new this.vehicleModelModel(
      createVehicleModelDto,
    );
    return createdVehicleModel.save();
  }

  async findAll(): Promise<VehicleModelDocument[]> {
    return this.vehicleModelModel.find().exec();
  }

  async find(id: string): Promise<VehicleModelDocument> {
    return this.vehicleModelModel.findById(id).exec();
  }

  async update(
    id: string,
    createVehicleModelDto: CreateVehicleModelDto,
  ): Promise<VehicleModelDocument> {
    return this.vehicleModelModel
      .findByIdAndUpdate(
        id,
        { $set: { ...createVehicleModelDto } },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<VehicleModelDocument> {
    return this.vehicleModelModel.findByIdAndDelete(id).exec();
  }
}
