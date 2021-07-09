import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera, CameraDocument } from './schema/camera.schema';
import { CreateCameraDto } from './dto/create-camera.dto';

@Injectable()
export class CameraService {
  constructor(
    @InjectModel(Camera.name) private cameraModel: Model<CameraDocument>,
  ) {}

  async create(createCameraDto: CreateCameraDto): Promise<Camera> {
    const createdCamera = new this.cameraModel(createCameraDto);
    return createdCamera.save();
  }

  async findAll(): Promise<Camera[]> {
    return this.cameraModel.find().exec();
  }

  async find(id: string): Promise<Camera> {
    return this.cameraModel.findById(id).exec();
  }

  async findByGroup(group: string): Promise<CameraDocument[]> {
    return this.cameraModel.find({ group: group }).exec();
  }

  async findBySerial(serial: string): Promise<Camera> {
    return this.cameraModel.findOne({ serial: serial }).exec();
  }

  async update(id: string, createCameraDto: CreateCameraDto): Promise<Camera> {
    return this.cameraModel
      .findByIdAndUpdate(id, { $set: { ...createCameraDto } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Camera> {
    return this.cameraModel.findByIdAndDelete(id).exec();
  }
}
