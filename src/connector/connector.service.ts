import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schema/inspection.schema';

@Injectable()
export class ConnectorService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
  ) {}

  async updateInspectionStatus(id: string, status: string) {
    console.log(`Update ${id} __ ${status} requested.`);
    this.inspectionModel
      .updateOne({ _id: id }, { $set: { status: status } })
      .exec();
  }
}
