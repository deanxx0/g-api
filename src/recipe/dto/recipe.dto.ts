export class RecipeDto {
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
            seg: number;
            path: string;
          },
        ];
        ruleBase: string[];
      };
    },
  ];
}
