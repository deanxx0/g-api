import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KafkaService } from '@rob3000/nestjs-kafka';
import { Model } from 'mongoose';
import { InspectionStatus } from 'src/connector/enum/inspection-status';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection, InspectionDocument } from './schema/inspection.schema';

const topicInspectionCreated = 'glovis.fct.inspectionCreated';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
  ) {}

  async findAll(): Promise<Inspection[]> {
    return this.inspectionModel
      .find(
        {}
      )
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
      .find(
        {
          _id: { $gt: id },
        }
      )
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
    const fromDate = new Date(new Date(from).getTime());
    const toDate = new Date(new Date(to).getTime());
    return this.inspectionModel
      .find(
        { createdAt: { $gt: fromDate, $lt: toDate } }
      )
      .exec();
  }

  async findPeriodEI(from: string, to: string): Promise<Inspection[]> {
    const fromDate = new Date(new Date(from).getTime());
    const toDate = new Date(new Date(to).getTime());
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
    const createdDoc = createdInspection.save();

    this.sendCreatedInspection(await createdDoc);

    return createdDoc;
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
