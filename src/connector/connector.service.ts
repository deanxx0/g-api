import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schema/inspection.schema';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';

@Injectable()
export class ConnectorService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
  ) {}

  async updateInspectionStatus(id: string, status: string) {
    this.inspectionModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }

  async updateInspectionInferenceResult(
    id: string,
    createInferenceResult: CreateInferenceResultDto,
  ) {
    this.inspectionModel
      .updateOne(
        { _id: id },
        { $push: { inferenceResults: new Object(createInferenceResult) } },
      )
      .exec();
  }
}
