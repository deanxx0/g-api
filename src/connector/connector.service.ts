import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera, CameraDocument } from 'src/camera/schema/camera.schema';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schema/inspection.schema';
import { Light, LightDocument } from 'src/light/schema/light.schema';
import { FinalResult } from 'src/inspectionResult/enum/final-result';
import {
  InspectionResult,
  InspectionResultDocument,
} from 'src/inspectionResult/schema/inspection-result.schema';
import { Sensor, SensorDocument } from 'src/sensor/schema/sensor.schema';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';
import { Timetest, TimetestDocument } from './timetest/timetest.schema';
import {
  InspectionLog,
  InspectionLogDocument,
} from 'src/inspection/schema/inspection-log.schema';
import { CreateInspectionLogDto } from 'src/inspection/dto/create-inspection-log.dto';
import {
  InferenceResult,
  InferenceResultDocument,
} from './schema/inference-result.schema';

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
    @InjectModel(InspectionResult.name)
    private inspectionResultModel: Model<InspectionResultDocument>,
    @InjectModel(InspectionLog.name)
    private inspectionLogModel: Model<InspectionLogDocument>,
    @InjectModel(InferenceResult.name)
    private inferenceResultModel: Model<InferenceResultDocument>,
    @InjectModel(Timetest.name)
    private timetestModel: Model<TimetestDocument>,
  ) {}

  async createTimetest(createdTimetest): Promise<TimetestDocument> {
    const createdTimetestDoc = new this.timetestModel(createdTimetest);
    return await createdTimetestDoc.save();
  }

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

  async updateInspectionResultStatus(id: string, status: string) {
    this.inspectionResultModel
      .updateOne({ inspectionId: id }, { $set: { status: status } })
      .exec();
  }

  async createInspectionLog(inspectionId: string, status: string) {
    const inspectionDoc: InspectionDocument = await this.inspectionModel
      .findOne({ _id: inspectionId })
      .exec();

    let createdInspectionLogDto: CreateInspectionLogDto;
    let createdInspectionLog = new this.inspectionLogModel(
      createdInspectionLogDto,
    );

    createdInspectionLog.inspectionId = inspectionDoc._id;
    createdInspectionLog.inspectionNo = inspectionDoc.inspectionNo;
    createdInspectionLog.vehicleModel = inspectionDoc.vehicle.properties.model;
    createdInspectionLog.vehicleColor = inspectionDoc.vehicle.properties.color;
    createdInspectionLog.status = status;

    createdInspectionLog.save();
  }

  private arr: Array<CreateInferenceResultDto> = [];
  async createInferenceResult(
    createInferenceResultDto: CreateInferenceResultDto,
  ) {
    // insertMany 시도: 일정 개수 차면 create
    console.log('_______before pushed array:');
    this.arr.map((a) => console.log(a));
    this.arr.push(createInferenceResultDto);
    console.log('_______after pushed array:');
    this.arr.map((a) => console.log(a));
    if (this.arr.length >= 3) {
      console.log(`arr length >= 3 : inside if`);
      this.inferenceResultModel.insertMany(this.arr);
      console.log(`insert many!!! ${this.arr}`);
      this.arr = [];
    }

    // 하나씩 create
    // console.log(`create inference result!!! at service`)
    // const inferenceResultDoc = new this.inferenceResultModel(
    //   createInferenceResultDto,
    // );
    // return await inferenceResultDoc.save();
  }
  // insertMany 쿼리로 대체해서 모아 올릴 방법찾자
  // insertMany에는 추가할 객체들의 배열만 넣으면 되니까 배열 하나 만들어서 거기에 컨슘된 inferenceResult들을 박아두다가
  // 일정 개수가 모이거나 일정 시간마다 그 배열을 넣고 insertMany 하면 되지않을까
  // 그 일정 개수와 일정 시간을 어떻게 알수 있을까..

  // await this.inspectionModel
  //   .updateOne(
  //     { _id: id },
  //     { $push: { inferenceResults: new Object(createInferenceResult) } },
  //   )
  //   .exec();

  // const updatedInspection = this.inspectionModel.findById(id).exec();
  // await this.updateResultInfo(await updatedInspection);

  // async updateResultInfo(updatedInspection): Promise<ResultInfoDocument> {
  //   let updatedResultInfoDto: PostResultInfoDto;
  //   let updatedResultInfo = new this.resultInfoModel(updatedResultInfoDto);

  //   const totalDefects = updatedInspection.inferenceResults
  //     .map((x) => x.defects.length)
  //     .reduce((tot: number, el: number) => tot + el, 0);

  //   updatedResultInfo.endTime = updatedInspection.updatedAt;
  //   const elapseSec = Math.floor(
  //     (updatedInspection.updatedAt.getTime() -
  //       updatedInspection.createdAt.getTime()) /
  //       1000,
  //   );
  //   updatedResultInfo.elapseTime = await this.toTime(elapseSec);
  //   updatedResultInfo.totalDefects = await totalDefects;
  //   updatedResultInfo.totalSpecialDefects = 0;
  //   updatedResultInfo.totalGapDefects = 0;
  //   updatedResultInfo.finalResult =
  //     (await totalDefects) == 0 ? FinalResult.OK : FinalResult.NG;
  //   updatedResultInfo.inspectionStatus = updatedInspection.status;

  //   return await this.resultInfoModel
  //     .findByIdAndUpdate(updatedInspection._id, {
  //       $set: {
  //         endTime: updatedResultInfo.endTime,
  //         elapseTime: updatedResultInfo.elapseTime,
  //         totalDefects: updatedResultInfo.totalDefects,
  //         totalSpecialDefects: updatedResultInfo.totalSpecialDefects,
  //         totalGapDefects: updatedResultInfo.totalGapDefects,
  //         finalResult: updatedResultInfo.finalResult,
  //         inspectionStatus: updatedResultInfo.inspectionStatus,
  //       },
  //     })
  //     .exec();
  // }

  // async toTime(sec: number): Promise<string> {
  //   return new Date(sec * 1000).toISOString().substr(11, 8)
  // }
}
