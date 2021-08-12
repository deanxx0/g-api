import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schema/log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private LogModel: Model<LogDocument>,
  ) {}

  async findByFilter(
    from: string,
    to: string,
    type: string,
  ): Promise<LogDocument[]> {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 9 hours
    const fromDate = new Date(
      new Date(`${from}T00:00:00.000Z`).getTime() - KR_TIME_DIFF,
    );
    const toDate = new Date(
      new Date(`${to}T23:59:59.000Z`).getTime() - KR_TIME_DIFF,
    );

    if (type == 'all') {
      return this.LogModel.find({
        createdAt: { $gte: fromDate, $lte: toDate },
      }).exec();
    } else {
      return this.LogModel.find({
        createdAt: { $gte: fromDate, $lte: toDate },
        type: type,
      }).exec();
    }
  }

  async findAll(): Promise<LogDocument[]> {
    return this.LogModel.find().exec();
  }

  async findAllLimitDesc(limit: string): Promise<LogDocument[]> {
    return this.LogModel.find({})
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .exec();
  }

  async findLatest(): Promise<LogDocument> {
    return this.LogModel.findOne().sort({ _id: -1 }).limit(1).exec();
  }
}
