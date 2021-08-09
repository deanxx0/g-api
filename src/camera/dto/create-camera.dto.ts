export class CreateCameraDto {
  name: string;
  groups: string[];
  status: string;
  serial: string;
  workingFolderPath: string;
  type: string;
  ip: string;
  nicIp: string;
  serverIp: string;
  x: number;
  y: number;
  z: number;
  resolution: number;
  fov: number;
}
