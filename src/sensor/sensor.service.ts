import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Sensor, SensorDocument } from './schema/sensor.schema';

@Injectable()
export class SensorService {
  constructor(
    @InjectModel(Sensor.name) private sensorModel: Model<SensorDocument>,
  ) {}

  async create(createSensorDto: CreateSensorDto): Promise<SensorDocument> {
    const createdSensor = new this.sensorModel(createSensorDto);
    const a = 0; // test github
    return createdSensor.save();
  }

  async findAll(): Promise<SensorDocument[]> {
    return this.sensorModel.find().exec();
  }

  async find(id: string): Promise<SensorDocument> {
    return this.sensorModel.findById(id).exec();
  }

  async update(
    id: string,
    createSensorDto: CreateSensorDto,
  ): Promise<SensorDocument> {
    return this.sensorModel
      .findByIdAndUpdate(id, { $set: { ...createSensorDto } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<SensorDocument> {
    return this.sensorModel.findByIdAndDelete(id).exec();
  }
}
