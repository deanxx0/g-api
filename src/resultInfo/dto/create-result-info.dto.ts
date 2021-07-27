import { ObjectId } from 'mongoose';
import { FinalResult } from '../enum/final-result';

export class CreateResultInfoDto {
  _id: ObjectId;
  inspectionNo: number;
  startTime: Date;
  endTime: Date;
  elapseTime: number;
  vehicleModel: String;
  vehicleColor: String;
  vinCode: String;
  totalDefects: number;
  totalSpecialDefects: number;
  totalGapDefects: number;
  finalResult: FinalResult;
  inspectionStatus: String;
}
