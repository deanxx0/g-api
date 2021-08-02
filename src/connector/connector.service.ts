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
    // EndInspection 업데이트 시 inspectionResult 문서의 endtime과 elapsetime 업데이트 해야한다.
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

  private inferencResultCache: Array<CreateInferenceResultDto> = [];

  async createInferenceResult() {
    if (this.inferencResultCache.length == 0) return;
    this.inferenceResultModel.insertMany(this.inferencResultCache);
    this.inferencResultCache = [];
    // console.log(`insertMany at interval...`);
  }

  private defectsCache = {
    inspectionId: "",
    defects: 0,
    specialDefects: 0,
    gapDefects: 0
  }
  // defectsCache들이 들어올 큐가 필요
  // 이 큐에다 inspectionId가 다른게 4개 들어오면 첫번들어온걸 pop해버리는걸로 메모리쌓이는거 방지
  async pushInferenceResult(
    createInferenceResultDto: CreateInferenceResultDto,
  ) {
    // 문서가 들어올때마다 해당 defect들의 개수를 캐시해두자
    const specialDefectsCode = 10;
    const gapDefectsCode = 100;
    const defectsTemp = {
      inspectionId: createInferenceResultDto.inspectionId,
      defects: createInferenceResultDto.defects.length,
      specialDefects: createInferenceResultDto.defects.map(obj => {
        if(obj.code == specialDefectsCode) return obj; 
      }).length,
      gapDefects: createInferenceResultDto.defects.map(obj => {
        if(obj.code == gapDefectsCode) return obj; 
      }).length
    };

    // insertMany: 일정 개수 차면 create
    // console.log('_______before pushed array:');
    // this.arr.map((a) => console.log(a));
    this.inferencResultCache.push(createInferenceResultDto);
    // console.log('_______after pushed array:');
    // this.arr.map((a) => console.log(a));
    // const bulkCount = 3;
    // if (this.arr.length >= bulkCount) {
    //   // console.log(`inside if bulk count: ${bulkCount}`);
    //   this.inferenceResultModel.insertMany(this.arr);
    //   // console.log(`insert many!!! ${this.arr}`);
    //   this.arr = [];
    // }

    // 하나씩 create
    // console.log(`create inference result!!! at service`)
    // const inferenceResultDoc = new this.inferenceResultModel(
    //   createInferenceResultDto,
    // );
    // return await inferenceResultDoc.save();
  }

  

  async updateInspectionResult() {
    // 각 결함 수를 구해야한다
    // pushInferenceResult 함수에서 하나 받을때마다 해당 inspection의 디펙 정보들을 캐시해두고 가져오기만하자.
    // 전역 큐가 있을건데 그 큐의 객체들 정보 전부 업뎃
    // this.inspectionResultModel
    //   .updateOne({ inspectionId: id }, { $set: { totalDefects: defects, totalSpecialDefects: specialDefects, totalGapDefects: gapDefects } })
    //   .exec();
  }



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
