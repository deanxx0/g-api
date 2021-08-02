export class CreateInferenceResultDto {
  inspectionId: string;
  inspectionNo: number;
  camera: string;
  cameraName: string;
  grab: {
    seq: number;
    distance: number;
  };
  defects: [
    {
      x: number;
      y: number;
      width: number;
      height: number;
      code: number;
    },
  ];
}
