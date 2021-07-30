export class CreateInferenceResultDto {
  inspectionId: string;
  camera: string;
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
