import { ObjectId } from 'mongoose';
import { FinalResult } from '../enum/final-result';

export class PostInspectionResultDto {
  insepctionId: ObjectId;
  inspectionNo: number;
  startTime: Date;
  endTime: Date;
  elapseTime: string;
  vehicleModel: String;
  vehicleColor: String;
  vinCode: String;
  totalDefects: number;
  totalSpecialDefects: number;
  totalGapDefects: number;
  finalResult: FinalResult;
  inspectionStatus: String;
}
