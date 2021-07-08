export class VehicleDto {
  name: String;
  vinCode: String; //차량고유번호 예:시리얼번호
  properties: {
    width: number;
    height: number;
    length: number;
    model: string;
    color: String;
  };
  options: String[];
}
