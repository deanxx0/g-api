import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResultInfo, ResultInfoDocument } from './schema/result-info.schema';

@Injectable()
export class ResultInfoService {
  constructor(
    @InjectModel(ResultInfo.name) private resultInfoModel: Model<ResultInfoDocument>,
  ) {}

  async findAll(): Promise<ResultInfoDocument[]> {
    return this.resultInfoModel.find().exec();
  }

  async find(id: string): Promise<ResultInfoDocument> {
    return this.resultInfoModel.findById(id).exec();
  }

  async delete(id: string): Promise<ResultInfoDocument> {
    return this.resultInfoModel.findByIdAndDelete(id).exec();
  }
}
