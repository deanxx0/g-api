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

  async findByFilter(
    from: string,
    to: string,
    type: string,
  ): Promise<InspectionLogDocument[]> {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 9 hours
    const fromDate = new Date(
      new Date(`${from}T00:00:00.000Z`).getTime() - KR_TIME_DIFF,
    );
    const toDate = new Date(
      new Date(`${to}T23:59:59.000Z`).getTime() - KR_TIME_DIFF,
    );

    if (type == 'all') {
      return this.inspectionLogModel
        .find({
          createdAt: { $gte: fromDate, $lte: toDate },
        })
        .exec();
    } else {
      return this.inspectionLogModel
        .find({
          createdAt: { $gte: fromDate, $lte: toDate },
          type: type,
        })
        .exec();
    }
  }

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
