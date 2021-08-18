export class VehicleDto {
  name: String;
  vinCode: String;
  vinNumber: String;
  properties: {
    width: number;
    height: number;
    length: number;
    model: string;
    color: String;
    detailColor: string;
  };
  options: String[];
}
