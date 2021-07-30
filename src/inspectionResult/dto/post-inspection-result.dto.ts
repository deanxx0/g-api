import { FinalResult } from '../enum/final-result';

export class PostInspectionResultDto {
  inspectionId: string;
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
  status: String;
}
