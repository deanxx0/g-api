import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection, InspectionDocument } from './schema/inspection.schema';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
  ) {}

  async findAll(): Promise<Inspection[]> {
    return this.inspectionModel.find().exec();
  }

  async find(id: string): Promise<Inspection> {
    return this.inspectionModel.findById(id).exec();
  }

  async findAfterId(id: string, limit: string): Promise<Inspection[]> {
    return this.inspectionModel.find({
      '_id': {$gt: id}
    }).limit(parseInt(limit)).exec();
  }

  async findPeriod(from: string, to: string): Promise<Inspection[]> {
    const fromDate = new Date(new Date(from).getTime());
    const toDate = new Date(new Date(to).getTime());
    return this.inspectionModel.find({ createdAt: { $gt: fromDate, $lt: toDate } }).exec();
  }

  async findLatest(): Promise<Inspection[]> {
    return this.inspectionModel.find().sort( { _id: -1 }).limit(1).exec();
  }

  async create(createInspectionDto: CreateInspectionDto): Promise<Inspection> {
    const createdInspection = new this.inspectionModel(createInspectionDto);
    return createdInspection.save();
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
}
