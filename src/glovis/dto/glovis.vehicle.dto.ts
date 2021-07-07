export class VehicleDto {
  name: String; 
  vinCode: String; //차량고유번호 예:시리얼번호
  properties: {
    width: number;
    height: number;
    Length: number;
    Color: String;
  }
  options: String[];
  createdAt: string;
  updatedAt: string;
}