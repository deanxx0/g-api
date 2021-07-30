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
import { InspectionResult, InspectionResultDocument } from '../resultInfo/schema/inspection-result.schema';
import { CreateInspectionResultDto } from '../resultInfo/dto/create-inspection-result.dto';
import { FinalResult } from '../resultInfo/enum/final-result';

const topicInspectionCreated = 'glovis.fct.inspectionCreated';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
    @InjectModel(InspectionLog.name)
    private inspectionLogModel: Model<InspectionLogDocument>,
    @InjectModel(InspectionResult.name)
    private inspectionResultModel: Model<InspectionResultDocument>,
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

  async createResultInfo(createdDoc): Promise<InspectionResultDocument> {
    let createdInspectionResultDto: CreateInspectionResultDto;
    let createdInspectionResult = new this.inspectionResultModel(createdInspectionResultDto);

    createdInspectionResult.insepctionId = createdDoc._id;
    createdInspectionResult.inspectionNo = createdDoc.inspectionNo;
    createdInspectionResult.startTime = createdDoc.createdAt;
    createdInspectionResult.endTime = createdDoc.updatedAt;
    createdInspectionResult.elapseTime = '00:00:00';
    createdInspectionResult.vehicleModel = createdDoc.vehicle.properties.model;
    createdInspectionResult.vehicleColor = createdDoc.vehicle.properties.color;
    createdInspectionResult.vinCode = createdDoc.vehicle.vinCode;
    createdInspectionResult.totalDefects = 0;
    createdInspectionResult.totalSpecialDefects = 0;
    createdInspectionResult.totalGapDefects = 0;
    createdInspectionResult.finalResult = FinalResult.READY;
    createdInspectionResult.inspectionStatus = createdDoc.status;
    return createdInspectionResult.save();
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
    return this.inspectionModel
      .findByIdAndUpdate(id, {
        $set: {
          ...createInspectionDto,
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
