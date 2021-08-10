import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InferenceResult, InferenceResultDocument } from 'src/inferenceResult/schema/inference-result.schema';

@Injectable()
export class DefectMapService {
  constructor(
    @InjectModel(InferenceResult.name) private inferenceResultModel: Model<InferenceResultDocument>,
  ) {}

  async findAll(): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel.find().exec();
  }

  async findById(id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultModel.findById(id);
  }
}
