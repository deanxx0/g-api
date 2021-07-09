import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera, CameraDocument } from 'src/camera/schema/camera.schema';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schema/inspection.schema';
import { Light, LightDocument } from 'src/light/schema/light.schema';
import { Sensor, SensorDocument } from 'src/sensor/schema/sensor.schema';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';

@Injectable()
export class ConnectorService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
    @InjectModel(Sensor.name)
    private sensorModel: Model<SensorDocument>,
    @InjectModel(Camera.name)
    private cameraModel: Model<CameraDocument>,
    @InjectModel(Light.name)
    private lightModel: Model<LightDocument>,
  ) {}

  async updateLightStatus(id: string, status: string) {
    this.lightModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }

  async updateCameraStatus(id: string, status: string) {
    this.cameraModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }

  async updateSensorStatus(id: string, status: string) {
    this.sensorModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }

  async updateInspectionStatus(id: string, status: string) {
    this.inspectionModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }

  async updateInspectionInferenceResult(
    id: string,
    createInferenceResult: CreateInferenceResultDto,
  ) {
    this.inspectionModel
      .updateOne(
        { _id: id },
        { $push: { inferenceResults: new Object(createInferenceResult) } },
      )
      .exec();
  }
}
