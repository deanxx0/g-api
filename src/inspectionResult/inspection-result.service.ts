import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InspectionResult,
  InspectionResultDocument,
} from './schema/inspection-result.schema';

@Injectable()
export class InspectionResultService {
  constructor(
    @InjectModel(InspectionResult.name)
    private inspectionResultModel: Model<InspectionResultDocument>,
  ) {}

  async findFilter(
    from: string,
    to: string,
    model: string,
    color: string,
  ): Promise<InspectionResultDocument[]> {
    const fromDate = new Date(new Date(`${from}T00:00:00`).getTime());
    const toDate = new Date(new Date(`${to}T11:59:00`).getTime());

    if (model == 'all' && color == 'all') {
      return this.inspectionResultModel
        .find({ createdAt: { $gt: fromDate, $lt: toDate } })
        .exec();
    } else if (color == 'all') {
      return this.inspectionResultModel
        .find({
          createdAt: { $gt: fromDate, $lt: toDate },
          vehicleModel: model,
        })
        .exec();
    } else if (model == 'all') {
      return this.inspectionResultModel
        .find({
          createdAt: { $gt: fromDate, $lt: toDate },
          vehicleColor: color,
        })
        .exec();
    } else {
      return this.inspectionResultModel
        .find({
          createdAt: { $gt: fromDate, $lt: toDate },
          vehicleModel: model,
          vehicleColor: color,
        })
        .exec();
    }
  }

  async findAll(): Promise<InspectionResultDocument[]> {
    return this.inspectionResultModel.find().exec();
  }

  async findAllLimit(limit: string): Promise<InspectionResultDocument[]> {
    return this.inspectionResultModel
      .find({})
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .exec();
  }

  async findPeriod(
    from: string,
    to: string,
  ): Promise<InspectionResultDocument[]> {
    const fromDate = new Date(new Date(`${from}T00:00:00`).getTime());
    const toDate = new Date(new Date(`${to}T11:59:00`).getTime());
    return this.inspectionResultModel
      .find({ createdAt: { $gt: fromDate, $lt: toDate } })
      .exec();
  }

  async findLatest(): Promise<InspectionResultDocument> {
    return this.inspectionResultModel
      .findOne()
      .sort({ _id: -1 })
      .limit(1)
      .exec();
  }

  async findByInspectionId(id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultModel.findOne({ inspectionId: id }).exec();
  }

  async delete(id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultModel.findByIdAndDelete(id).exec();
  }
}
