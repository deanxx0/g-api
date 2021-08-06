import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';
import {
  InferenceResult,
  InferenceResultDocument,
} from './schema/inference-result.schema';

@Injectable()
export class InferenceResultService {
  constructor(
    @InjectModel(InferenceResult.name)
    private inferenceResultModel: Model<InferenceResultDocument>,
  ) {}

  async findByInspectionId(id: string): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel.find({ inspectionId: id }).exec();
  }

  async getDefectsByInspectionId(inspectionId: string): Promise<object[]> {
    const inferDocs: InferenceResult[] = await this.inferenceResultModel
      .find({ inspectionId: inspectionId })
      .exec();

    let inferDocsPerDefect: Array<object> = [];

    inferDocs.forEach((inferDoc) => {
      inferDoc.defects.forEach((defect, index) => {
        const dividedInferDoc = {
          inspectionId: inferDoc.inspectionId,
          inspectionNo: inferDoc.inspectionNo,
          camera: inferDoc.camera,
          cameraName: inferDoc.cameraName,
          grab: inferDoc.grab,
          seq: index,
          defect: defect,
        };
        inferDocsPerDefect.push(dividedInferDoc);
      });
    });

    return inferDocsPerDefect;
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
