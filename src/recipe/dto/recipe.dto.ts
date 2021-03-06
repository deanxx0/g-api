export class RecipeDto {
  name: string;
  lights: [
    {
      name: string;
      patterns: [
        {
          distance: number;
          path: string;
        },
      ];
    },
  ];
  cameras: [
    {
      name: string;
      grabs: number[];
      gains: [
        {
          distance: number;
          value: number;
        },
      ];
      exposureTimes: [
        {
          distance: number;
          value: number;
        },
      ];
      savingOptions: {
        ok: boolean;
        ng: boolean;
        okPath: string;
        ngPath: string;
      };
      inferenceStrategy: {
        models: [
          {
            seq: number;
            path: string;
          },
        ];
        ruleBases: [
          {
            seq: number;
            path: string;
          },
        ];
      };
    },
  ];
}
