export class PostCameraDto {
  name: string;
  groups: string[];
  status: string;
  serial: string;
  workingFolderPath: string; //로컬 저장 경로
  type: string; //카메라 종류 HIKVISION
  ip: string; //카메라 IP
  nicIp: string; //카메라가 연결되는 PORT IP
  serverIp: string; //카메라가 연결되는 서버 IP
  x: number;
  y: number;
  z: number;
  resolution: number;
  fov: number;
  rotation: number;
  flip: Boolean;
}
