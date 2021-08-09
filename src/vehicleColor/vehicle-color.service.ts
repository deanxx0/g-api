import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleColorDto } from './dto/create-vehicle-color.dto';
import {
  VehicleColor,
  VehicleColorDocument,
} from './schema/vehicle-color.schema';

@Injectable()
export class VehicleColorService {
  constructor(
    @InjectModel(VehicleColor.name)
    private vehicleColorModel: Model<VehicleColorDocument>,
  ) {}

  async create(
    createVehicleColorDto: CreateVehicleColorDto,
  ): Promise<VehicleColorDocument> {
    const createdVehicleColor = new this.vehicleColorModel(
      createVehicleColorDto,
    );
    return createdVehicleColor.save();
  }

  async findAll(): Promise<VehicleColorDocument[]> {
    return this.vehicleColorModel.find().exec();
  }

  async find(id: string): Promise<VehicleColorDocument> {
    return this.vehicleColorModel.findById(id).exec();
  }

  async update(
    id: string,
    createVehicleColorDto: CreateVehicleColorDto,
  ): Promise<VehicleColorDocument> {
    return this.vehicleColorModel
      .findByIdAndUpdate(
        id,
        { $set: { ...createVehicleColorDto } },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<VehicleColorDocument> {
    return this.vehicleColorModel.findByIdAndDelete(id).exec();
  }
}
