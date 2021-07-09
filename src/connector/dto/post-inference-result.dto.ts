export class PostInferenceResultDto {
  inspection: number;
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
