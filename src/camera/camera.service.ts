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
}
