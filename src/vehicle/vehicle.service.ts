import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleModelDto } from 'src/vehicleModel/dto/create-vehicle-model.dto';
import {
  VehicleModel,
  VehicleModelDocument,
} from 'src/vehicleModel/schema/vehicle-model.schema';
import { VehicleDto } from './dto/vehicle.dto';
import { Vehicle, VehicleDocument } from './schema/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(VehicleModel.name)
    private vehicleModelModel: Model<VehicleModelDocument>,
  ) {}

  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleModel.find().exec();
  }

  async findVehicle(id: string): Promise<Vehicle> {
    return this.vehicleModel.findById(id).exec();
  }

  async findByVin(vin: string): Promise<Vehicle> {
    return this.vehicleModel.findOne({ vinCode: vin }).exec();
  }

  async create(vehicleDto: VehicleDto): Promise<Vehicle> {
    const createdVehicle = new this.vehicleModel(vehicleDto);

    const vehicleModelDoc: CreateVehicleModelDto = {
      model: createdVehicle.properties.model,
    };

    const vehicleModelFindResult: VehicleModelDocument[] =
      await this.vehicleModelModel
        .find({ model: { $in: [vehicleModelDoc.model] } })
        .exec();

    if (vehicleModelFindResult.length == 0) {
      const createdVehicleModel = new this.vehicleModelModel(vehicleModelDoc);
      createdVehicleModel.save();
    }

    return createdVehicle.save();
  }

  async update(id: string, vehicleDto: VehicleDto): Promise<Vehicle> {
    return this.vehicleModel
      .findByIdAndUpdate(id, {
        $set: {
          ...vehicleDto,
        },
      })
      .exec();
  }

  async delete(id: string) {
    this.vehicleModel.deleteOne({ _id: id }).exec();
  }
}
