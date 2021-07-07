import { CreateCameraDto } from './create-camera.dto';

export class PostCameraDto {
  name: string;
  group: string[];
  status: string;
  serial: string;
  workingFolderPath: string; //로컬 저장 경로
  type: string; //카메라 종류 HIKVISION
  ip: string; //카메라 IP
  nicIp: string; //카메라가 연결되는 PORT IP
  serverIp: string; //카메라가 연결되는 서버 IP

  toCreateDto(): CreateCameraDto {
    return {
      name: this.name,
      group: this.group,
      status: this.status,
      serial: this.serial,
      workingFolderPath: this.workingFolderPath,
      type: this.type,
      ip: this.ip,
      nicIp: this.nicIp,
      serverIp: this.serverIp,
    };
  }
}
