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
import { Log, LogDocument } from 'src/log/schema/log.schema';
import { CreateLogDto } from 'src/log/dto/create-log.dto';
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
    @InjectModel(Log.name)
    private logModel: Model<LogDocument>,
    @InjectModel(InferenceResult.name)
    private inferenceResultModel: Model<InferenceResultDocument>,
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
    //return new Date(sec * 1000).toISOString().substr(11, 8);
    const hours = Math.floor(sec / 3600);
    sec %= 3600;
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    let formatHours = hours < 10 ? `0${hours}` : `${hours}`;
    let formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formatHours}:${formatMinutes}:${formatSeconds}`;
  }

  async createLog(system: string, type: string, description: string) {
    let createdLogDto: CreateLogDto;
    let createdLog = new this.logModel(createdLogDto);

    createdLog.system = system;
    createdLog.type = type;
    createdLog.description = description;

    createdLog.save();
  }

  async createInspectionLog(inspectionId: string, status: string) {
    const inspectionDoc: InspectionDocument = await this.inspectionModel
      .findOne({ _id: inspectionId })
      .exec();

    let createdLogDto: CreateLogDto;
    let createdLog = new this.logModel(createdLogDto);

    createdLog.system = 'MASTER';
    createdLog.type = 'INFO';
    createdLog.description = `InspectionNO: ${inspectionDoc.inspectionNo}, Status: ${status}, Vincode: ${inspectionDoc.vehicle.vinCode}, Model: ${inspectionDoc.vehicle.properties.model}, Color: ${inspectionDoc.vehicle.properties.color}`;

    createdLog.save();
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
    const colorCode = 10;
    const gapCode = 100;

    let totalDefects = 0;
    let totalColorDefects = 0;
    let totalGapDefects = 0;

    const inferDocs: InferenceResult[] = await this.inferenceResultModel
      .find({ inspectionId: inspectionId })
      .exec();

    inferDocs.forEach((inferDoc) => {
      totalDefects += inferDoc.defects.length;
      inferDoc.defects.forEach((defect) => {
        if (defect.code == colorCode) totalColorDefects++;
        if (defect.code == gapCode) totalGapDefects++;
      });
    });

    this.inspectionResultModel
      .updateOne(
        { inspectionId: inspectionId },
        {
          totalInferences: inferDocs.length,
          totalDefects: totalDefects,
          totalColorDefects: totalColorDefects,
          totalGapDefects: totalGapDefects,
        },
      )
      .exec();
  }
}
