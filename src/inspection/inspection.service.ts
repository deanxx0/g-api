import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InspectionDto } from './dto/inspection.dto';
import { Inspection, InspectionDocument } from './schema/inspection.schema';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private inspectionModel: Model<InspectionDocument>,
  ) {}

  async findAllInspection(): Promise<Inspection[]> {
    return this.inspectionModel.find().exec();
  }

  async findInspection(id: string): Promise<Inspection> {
    return this.inspectionModel.findById(id).exec();
  }

  async findInspectionsAfterId(id: string, limit: string): Promise<Inspection[]> {
    return this.inspectionModel.find({
      '_id': {$gt: id}
    }).limit(parseInt(limit)).exec();
  }

  async findInferenceResults(id: string, limit: string): Promise<Inspection[]> {
    return this.inspectionModel.find({
      '_id': {$gt: id},
    }).limit(parseInt(limit)).exec();
  }

  async createInspection(inspectionDto: InspectionDto): Promise<Inspection> {
    const createdInspection = new this.inspectionModel(inspectionDto);
    return createdInspection.save();
  }

  async updateInspection(
    id: string,
    inspectionDto: InspectionDto,
  ): Promise<Inspection> {
    return this.inspectionModel
      .findByIdAndUpdate(id, {
        $set: {
          ...inspectionDto,
        },
      })
      .exec();
  }

  async deleteInspection(id: string) {
    this.inspectionModel.deleteOne({ _id: id }).exec();
  }
}
