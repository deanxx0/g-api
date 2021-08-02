import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InferenceResult,
  InferenceResultDocument,
} from 'src/connector/schema/inference-result.schema';

@Injectable()
export class InferenceResultService {
  constructor(
    @InjectModel(InferenceResult.name)
    private inferenceResultModel: Model<InferenceResultDocument>,
  ) {}

  async findByInspectionId(id: string): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel.find({ inspectionId: id }).exec();
  }

  async findByInspectionIdAndCamera(
    inspectionId: string,
    cameraId: string,
  ): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel
      .find({ inspectionId: inspectionId, camera: cameraId })
      .exec();
  }

  async findAll(): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel.find().exec();
  }

  async find(id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultModel.findById(id).exec();
  }

  async delete(id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultModel.findByIdAndDelete(id).exec();
  }
}
