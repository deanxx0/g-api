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

  async findAll(): Promise<InspectionResultDocument[]> {
    return this.inspectionResultModel.find().exec();
  }

  async find(id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultModel.findById(id).exec();
  }

  async delete(id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultModel.findByIdAndDelete(id).exec();
  }
}
