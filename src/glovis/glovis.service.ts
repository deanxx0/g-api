import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDto } from './dto/glovis.vehicle.dto';
import { Vehicle, VehicleDocument } from './schma/glovis.vehicle.schma';

@Injectable()
export class GlovisService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>) {}

  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleModel.find().exec();
  }

  async findVehicle(id: string): Promise<Vehicle> {
    return this.vehicleModel.findById(id).exec();
  }

  async create(vehicleDto: VehicleDto): Promise<Vehicle> {
    const createdVehicle = new this.vehicleModel(vehicleDto);
    return createdVehicle.save();
  }

  async update(id: string, vehicleDto: VehicleDto): Promise<Vehicle> {
    return this.vehicleModel.findByIdAndUpdate(id, { $set: { 
      ...vehicleDto
    }}).exec();
  }

  async delete(id: string) {
    this.vehicleModel.deleteOne({ _id: id }).exec();
  }
}