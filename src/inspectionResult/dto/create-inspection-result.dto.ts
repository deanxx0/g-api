import { FinalResult } from '../enum/final-result';

export class CreateInspectionResultDto {
  inspectionId: string;
  inspectionNo: number;
  startTime: Date;
  endTime: Date;
  elapseTime: String;
  vehicleModel: String;
  vehicleColor: String;
  vinCode: String;
  totalDefects: number;
  totalColorDefects: number;
  totalGapDefects: number;
  finalResult: FinalResult;
  status: String;
}
