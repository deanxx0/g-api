import { FinalResult } from '../enum/final-result';

export class PostInspectionResultDto {
  inspectionId: string;
  inspectionNo: number;
  startTime: Date;
  endTime: Date;
  elapseTime: String;
  vehicleModel: String;
  vehicleColor: String;
  vinCode: String;
  totalInferences: number;
  totalDefects: number;
  totalColorDefects: number;
  totalGapDefects: number;
  finalResult: FinalResult;
  status: String;
}
