import { FinalResult } from "../enum/final-result";

export class PostResultInfoDto {
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
