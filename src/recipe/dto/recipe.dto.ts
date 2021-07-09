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
      inferenceStretegy: {
        models: [
          {
            seq: number;
            path: string;
          },
        ];
        ruleBase: string[];
      };
    },
  ];
}
