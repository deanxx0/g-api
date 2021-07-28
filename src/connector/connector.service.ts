import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera, CameraDocument } from 'src/camera/schema/camera.schema';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schema/inspection.schema';
import { Light, LightDocument } from 'src/light/schema/light.schema';
import { PostResultInfoDto } from 'src/resultInfo/dto/post-result-info.dto';
import { FinalResult } from 'src/resultInfo/enum/final-result';
import { ResultInfo, ResultInfoDocument } from 'src/resultInfo/schema/result-info.schema';
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
    @InjectModel(ResultInfo.name)
    private resultInfoModel: Model<ResultInfoDocument>,
  ) {}

  async updateLightStatus(id: string, status: string) {
    this.lightModel.updateOne({ _id: id }, { $set: { status: status } }).exec();
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

      const updatedInspection = this.inspectionModel.findById(id).exec();
      this.updateResultInfo(await updatedInspection);
  }

  async updateResultInfo(updatedInspection): Promise<ResultInfoDocument> {
    let updatedResultInfoDto: PostResultInfoDto;
    let updatedResultInfo = new this.resultInfoModel(updatedResultInfoDto);

    const totalDefects = updatedInspection.inferenceResults
      .map((x) => x.defects.length)
      .reduce((tot: number, el: number) => tot + el, 0);

    updatedResultInfo.endTime = updatedInspection.updatedAt;
    const elapseSec = Math.floor(
      (updatedInspection.updatedAt.getTime() -
        updatedInspection.createdAt.getTime()) /
        1000,
    );
    updatedResultInfo.elapseTime = await this.toTime(elapseSec);
    updatedResultInfo.totalDefects = await totalDefects;
    updatedResultInfo.totalSpecialDefects = 0;
    updatedResultInfo.totalGapDefects = 0;
    updatedResultInfo.finalResult =
      (await totalDefects) == 0 ? FinalResult.OK : FinalResult.NG;
    updatedResultInfo.inspectionStatus = updatedInspection.status;

    return await this.resultInfoModel
      .findByIdAndUpdate(updatedInspection._id, {
        $set: {
          endTime: updatedResultInfo.endTime,
          elapseTime: updatedResultInfo.elapseTime,
          totalDefects: updatedResultInfo.totalDefects,
          totalSpecialDefects: updatedResultInfo.totalSpecialDefects,
          totalGapDefects: updatedResultInfo.totalGapDefects,
          finalResult: updatedResultInfo.finalResult,
          inspectionStatus: updatedResultInfo.inspectionStatus,
        },
      })
      .exec();
  }

  async toTime(sec: number): Promise<string> {
    return new Date(sec * 1000).toISOString().substr(11, 8)
  }
}
