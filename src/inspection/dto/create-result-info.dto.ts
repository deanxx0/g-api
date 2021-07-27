import { FinalResult } from '../enum/final-result';

export class CreateResultInfoDto {
  inspectionNo: number;
  startTime: Date;
  endTime: Date;
  elapseTime: Date;
  vehicleModel: String;
  vehicleColor: String;
  vinCode: String;
  totalDefects: number;
  totalSpecialDefects: number;
  totalGapDefects: number;
  finalResult: FinalResult;
  inspectionStatus: String;
}
