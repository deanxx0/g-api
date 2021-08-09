import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModelDto } from 'src/model/dto/create-model.dto';
import { ModelDocument } from 'src/model/schema/model.schema';
import { VehicleDto } from './dto/vehicle.dto';
import { Vehicle, VehicleDocument } from './schema/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Model.name) private modelModel: Model<ModelDocument>,
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

    const modelDoc: CreateModelDto = {
      model: createdVehicle.properties.model,
    };

    const modelFindResult: ModelDocument[] = await this.modelModel
      .find({ model: { $in: [modelDoc.model] } })
      .exec();

    if (modelFindResult.length == 0) {
      const createdModel = new this.modelModel(modelDoc);
      createdModel.save();
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
