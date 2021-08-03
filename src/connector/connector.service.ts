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
import { CreateInferenceResultDto } from '../inferenceResult/dto/create-inference-result.dto';
import { Timetest, TimetestDocument } from './timetest/timetest.schema';
import {
  InspectionLog,
  InspectionLogDocument,
} from 'src/inspectionLog/schema/inspection-log.schema';
import { CreateInspectionLogDto } from 'src/inspectionLog/dto/create-inspection-log.dto';
import {
  InferenceResult,
  InferenceResultDocument,
} from 'src/inferenceResult/schema/inference-result.schema';

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

  async updateInspectionResultFinalResult(id: string) {
    const inspectionResultDoc = await this.inspectionResultModel
      .findOne({ inspectionId: id })
      .exec();
    const finalResult =
      inspectionResultDoc.totalDefects == 0 ? FinalResult.OK : FinalResult.NG;
    this.inspectionResultModel
      .updateOne({ inspectionId: id }, { $set: { finalResult: finalResult } })
      .exec();
  }

  async updateInspectionResultTime(id: string) {
    const inspectionDoc: any = await this.inspectionModel
      .findOne({ _id: id })
      .exec();
    const endTime = await inspectionDoc.updatedAt;
    const elapseTimeSec = Math.floor(
      (endTime.getTime() - inspectionDoc.createdAt.getTime()) / 1000,
    );
    const elapseTime: string = await this.toTime(elapseTimeSec);

    this.inspectionResultModel
      .updateOne(
        { inspectionId: id },
        { $set: { endTime: endTime, elapseTime: elapseTime } },
      )
      .exec();
  }

  async toTime(sec: number): Promise<string> {
    return new Date(sec * 1000).toISOString().substr(11, 8);
  }

  async createInspectionLog(inspectionId: string, status: string) {
    const inspectionDoc: InspectionDocument = await this.inspectionModel
      .findOne({ _id: inspectionId })
      .exec();

    let createdInspectionLogDto: CreateInspectionLogDto;
    let createdInspectionLog = new this.inspectionLogModel(
      createdInspectionLogDto,
    );

    createdInspectionLog.system = 'MASTER';
    createdInspectionLog.type = 'INFO';
    createdInspectionLog.description = `InspectionNO: ${inspectionDoc.inspectionNo}, Status: ${status}, Vincode: ${inspectionDoc.vehicle.vinCode}, Model: ${inspectionDoc.vehicle.properties.model}, Color: ${inspectionDoc.vehicle.properties.color}`;

    createdInspectionLog.save();
  }

  private inferencResultCache: Array<CreateInferenceResultDto> = [];

  async createInferenceResult() {
    if (this.inferencResultCache.length == 0) return;
    this.inferenceResultModel.insertMany(this.inferencResultCache);
    this.inferencResultCache = [];
  }

  async pushInferenceResult(
    createInferenceResultDto: CreateInferenceResultDto,
  ) {
    this.inferencResultCache.push(createInferenceResultDto);
  }

  async updateInspectionResultDefects(inspectionId: string) {
    const specialCode = 10;
    const gapCode = 100;

    let totalDefects = 0;
    let totalSpecialDefects = 0;
    let totalGapDefects = 0;

    const inferDocs: InferenceResult[] = await this.inferenceResultModel
      .find({ inspectionId: inspectionId })
      .exec();

    inferDocs.forEach((inferDoc) => {
      totalDefects += inferDoc.defects.length;
      inferDoc.defects.forEach((defect) => {
        if (defect.code == specialCode) totalSpecialDefects++;
        if (defect.code == gapCode) totalGapDefects++;
      });
    });

    this.inspectionResultModel
      .updateOne(
        { inspectionId: inspectionId },
        {
          totalDefects: totalDefects,
          totalSpecialDefects: totalSpecialDefects,
          totalGapDefects: totalGapDefects,
        },
      )
      .exec();
  }
}
