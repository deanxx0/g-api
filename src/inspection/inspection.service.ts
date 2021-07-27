import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KafkaService } from '@dean/nestjs-kafka';
import { Model } from 'mongoose';
import { InspectionStatus } from 'src/connector/enum/inspection-status';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection, InspectionDocument } from './schema/inspection.schema';
import {
  InspectionLog,
  InspectionLogDocument,
} from './schema/inspection-log.schema';
import { CreateInspectionLogDto } from './dto/create-inspection-log.dto';
import {
  ResultInfo,
  ResultInfoDocument,
} from '../resultInfo/schema/result-info.schema';
import { CreateResultInfoDto } from '../resultInfo/dto/create-result-info.dto';
import { FinalResult } from '../resultInfo/enum/final-result';
import { PostResultInfoDto } from 'src/resultInfo/dto/post-result-info.dto';

const topicInspectionCreated = 'glovis.fct.inspectionCreated';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
    @InjectModel(InspectionLog.name)
    private inspectionLogModel: Model<InspectionLogDocument>,
    @InjectModel(ResultInfo.name)
    private resultInfoModel: Model<ResultInfoDocument>,
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
  ) {}

  async findAll(): Promise<Inspection[]> {
    return this.inspectionModel.find({}).exec();
  }

  async findAllLimit(limit: string): Promise<Inspection[]> {
    return this.inspectionModel
      .find({})
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .exec();
  }

  async findAllEI(): Promise<Inspection[]> {
    return this.inspectionModel
      .find(
        {},
        {
          inspectionNo: 1,
          vehicle: 1,
          recipe: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .exec();
  }

  async find(id: string): Promise<Inspection> {
    return this.inspectionModel.findById(id).exec();
  }

  async findAfterId(id: string, limit: string): Promise<Inspection[]> {
    return this.inspectionModel
      .find({
        _id: { $gt: id },
      })
      .limit(parseInt(limit))
      .exec();
  }

  async findAfterIdEI(id: string, limit: string): Promise<Inspection[]> {
    return this.inspectionModel
      .find(
        {
          _id: { $gt: id },
        },
        {
          inspectionNo: 1,
          vehicle: 1,
          recipe: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .limit(parseInt(limit))
      .exec();
  }

  async findPeriod(from: string, to: string): Promise<Inspection[]> {
    const fromDate = new Date(new Date(`${from}T00:00:00`).getTime());
    const toDate = new Date(new Date(`${to}T11:59:00`).getTime());
    return this.inspectionModel
      .find({ createdAt: { $gt: fromDate, $lt: toDate } })
      .exec();
  }

  async findPeriodEI(from: string, to: string): Promise<Inspection[]> {
    const fromDate = new Date(new Date(`${from}T00:00:00`).getTime());
    const toDate = new Date(new Date(`${to}T11:59:00`).getTime());
    return this.inspectionModel
      .find(
        { createdAt: { $gt: fromDate, $lt: toDate } },
        {
          inspectionNo: 1,
          vehicle: 1,
          recipe: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .exec();
  }

  async findLatest(): Promise<Inspection> {
    return this.inspectionModel.findOne().sort({ _id: -1 }).limit(1).exec();
  }

  async create(createInspectionDto: CreateInspectionDto): Promise<Inspection> {
    const createdInspection = new this.inspectionModel(createInspectionDto);

    createdInspection.status = InspectionStatus.PreInspection;

    this.createInspectionLog(createdInspection);

    const createdDoc = createdInspection.save();
    this.sendCreatedInspection(await createdDoc);

    this.createResultInfo(await createdDoc);

    return createdDoc;
  }

  async createResultInfo(createdDoc): Promise<ResultInfoDocument> {
    let createdResultInfoDto: CreateResultInfoDto;
    let createdResultInfo = new this.resultInfoModel(createdResultInfoDto);

    createdResultInfo._id = createdDoc._id;
    createdResultInfo.inspectionNo = createdDoc.inspectionNo;
    createdResultInfo.startTime = createdDoc.createdAt;
    createdResultInfo.endTime = createdDoc.updatedAt;
    createdResultInfo.elapseTime = 0;
    createdResultInfo.vehicleModel = createdDoc.vehicle.properties.model;
    createdResultInfo.vehicleColor = createdDoc.vehicle.properties.color;
    createdResultInfo.vinCode = createdDoc.vehicle.vinCode;
    createdResultInfo.totalDefects = 0;
    createdResultInfo.totalSpecialDefects = 0;
    createdResultInfo.totalGapDefects = 0;
    createdResultInfo.finalResult = FinalResult.READY;
    createdResultInfo.inspectionStatus = createdDoc.status;
    return createdResultInfo.save();
  }

  async createInspectionLog(
    createdInspection: InspectionDocument,
  ): Promise<InspectionLogDocument> {
    let createdInspectionLogDto: CreateInspectionLogDto;
    let createdInspectionLog = new this.inspectionLogModel(
      createdInspectionLogDto,
    );

    createdInspectionLog.inspectionNo = createdInspection.inspectionNo;
    createdInspectionLog.vehicleModel =
      createdInspection.vehicle.properties.model;
    createdInspectionLog.vehicleColor =
      createdInspection.vehicle.properties.color;
    createdInspectionLog.inspectionStatus = InspectionStatus.PreInspection;

    return createdInspectionLog.save();
  }

  async update(
    id: string,
    createInspectionDto: CreateInspectionDto,
  ): Promise<Inspection> {
    const inspectionDoc: Promise<InspectionDocument> = this.inspectionModel
      .findByIdAndUpdate(id, {
        $set: {
          ...createInspectionDto,
        },
      })
      .exec();
    
    const updatedInspection = this.inspectionModel.findById((await inspectionDoc)._id).exec();
    
    this.updateResultInfo(await updatedInspection);

    return await updatedInspection;
  }

  async updateResultInfo(updatedInspection): Promise<ResultInfoDocument> {
    let updatedResultInfoDto: PostResultInfoDto;
    let updatedResultInfo = new this.resultInfoModel(updatedResultInfoDto);

    const totalDefects = updatedInspection.inferenceResults
      .map((x) => x.defects.length)
      .reduce((tot: number, el: number) => tot + el, 0);

    updatedResultInfo.endTime = updatedInspection.updatedAt;
    updatedResultInfo.elapseTime = Math.floor(
      (updatedInspection.updatedAt.getTime() -
        updatedInspection.createdAt.getTime()) /
        1000,
    );
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

  async delete(id: string) {
    this.inspectionModel.deleteOne({ _id: id }).exec();
  }

  async sendCreatedInspection(inspection: InspectionDocument) {
    await this.kafkaService.send({
      topic: topicInspectionCreated,
      messages: [
        {
          key: null,
          value: inspection.toJSON(),
        },
      ],
    });
  }
}
