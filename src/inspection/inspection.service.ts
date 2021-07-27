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
import { ResultInfo, ResultInfoDocument } from './schema/result-info.schema';
import { CreateResultInfoDto } from './dto/create-result-info.dto';
import { FinalResult } from './enum/final-result';

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

    this.createResultInfo(createdDoc);

    return createdDoc;
  }

  async createResultInfo(createdDoc): Promise<ResultInfoDocument> {
    let createdResultInfoDto: CreateResultInfoDto;
    let createdResultInfo = new this.resultInfoModel(createdResultInfoDto);

    createdResultInfo.inspectionNo = createdDoc.inspectionNo;
    createdResultInfo.startTime = createdDoc.createdAt;
    createdResultInfo.endTime = createdDoc.updatedAt;
    createdResultInfo.elapseTime = new Date(
      createdDoc.createdAt - createdDoc.updatedAt,
    );
    createdResultInfo.vehicleModel = createdDoc.vehicle.properties.model;
    createdResultInfo.vehicleColor = createdDoc.vehicle.properties.color;
    createdResultInfo.vinCode = createdDoc.vehicle.vincode;
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
    const updatedInspection: Promise<InspectionDocument> = this.inspectionModel
      .findByIdAndUpdate(id, {
        $set: {
          ...createInspectionDto,
        },
      })
      .exec();

    this.updateResultInfo(id, updatedInspection);

    return updatedInspection;
  }

  async updateResultInfo(
    id: string,
    updatedInspection,
  ): Promise<ResultInfoDocument> {
    let createdResultInfoDto: CreateResultInfoDto;
    let createdResultInfo = new this.resultInfoModel(createdResultInfoDto);

    const totalDefects = updatedInspection.inferenceResults
      .map((x) => x.defects.length)
      .reduce((tot: number, el: number) => tot + el, 0);

    createdResultInfo.startTime = updatedInspection.createdAt;
    createdResultInfo.endTime = updatedInspection.updatedAt;
    createdResultInfo.elapseTime = new Date(
      updatedInspection.createdAt - updatedInspection.updatedAt,
    );
    createdResultInfo.totalDefects = 0;
    createdResultInfo.totalSpecialDefects = 0;
    createdResultInfo.totalGapDefects = 0;
    createdResultInfo.finalResult = FinalResult.READY;
    createdResultInfo.inspectionStatus = updatedInspection.status;
    return createdResultInfo.save();
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
