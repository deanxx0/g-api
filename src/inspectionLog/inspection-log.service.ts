import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InspectionLog,
  InspectionLogDocument,
} from './schema/inspection-log.schema';

@Injectable()
export class InspectionLogService {
  constructor(
    @InjectModel(InspectionLog.name)
    private inspectionLogModel: Model<InspectionLogDocument>,
  ) {}

  async findAll(): Promise<InspectionLogDocument[]> {
    return this.inspectionLogModel.find().exec();
  }

  async findAllLimitDesc(limit: string): Promise<InspectionLogDocument[]> {
    return this.inspectionLogModel
      .find({})
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .exec();
  }

  async findLatest(): Promise<InspectionLogDocument> {
    return this.inspectionLogModel.findOne().sort({ _id: -1 }).limit(1).exec();
  }
}
