export class CameraDto {
  _id: string;
  name: String;
  group: String[];
  status: String;
  serial: String;
  workingFolderPath: String; //로컬 저장 경로
  type: string; //카메라 종류 HIKVISION
  ip: String; //카메라 IP
  nic_ip: String; //카메라가 연결되는 PORT IP
  server_ip: String; //카메라가 연결되는 서버 IP
  createdAt: string;
  updatedAt: string;
}
