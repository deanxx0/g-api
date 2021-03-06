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

  async getModelColorList(): Promise<object> {
    let modelSet = new Set<String>();
    let colorSet = new Set<String>();
    modelSet.add('all');
    colorSet.add('all');

    const docs = await this.inspectionResultModel.find(
      {},
      { vehicleModel: 1, vehicleColor: 1 },
    );

    docs.forEach((doc) => {
      modelSet.add(doc.vehicleModel);
      colorSet.add(doc.vehicleColor);
    });

    const models: Array<String> = [...modelSet];
    const colors: Array<String> = [...colorSet];

    return {
      models,
      colors,
    };
  }

  async getInspectionIdByVincode(vincode: string): Promise<String> {
    return (
      await this.inspectionResultModel.findOne(
        { vinCode: vincode },
        { inspectionId: 1 },
      )
    ).inspectionId;
  }

  async findByFilter(
    from: string,
    to: string,
    model: string,
    color: string,
  ): Promise<InspectionResultDocument[]> {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 9 hours
    const fromDate = new Date(
      new Date(`${from}T00:00:00.000Z`).getTime() - KR_TIME_DIFF,
    );
    const toDate = new Date(
      new Date(`${to}T23:59:59.000Z`).getTime() - KR_TIME_DIFF,
    );

    if (model == 'all' && color == 'all') {
      return this.inspectionResultModel
        .find({ createdAt: { $gte: fromDate, $lte: toDate } })
        .exec();
    } else if (color == 'all') {
      return this.inspectionResultModel
        .find({
          createdAt: { $gte: fromDate, $lte: toDate },
          vehicleModel: model,
        })
        .exec();
    } else if (model == 'all') {
      return this.inspectionResultModel
        .find({
          createdAt: { $gte: fromDate, $lte: toDate },
          vehicleColor: color,
        })
        .exec();
    } else {
      return this.inspectionResultModel
        .find({
          createdAt: { $gte: fromDate, $lte: toDate },
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
