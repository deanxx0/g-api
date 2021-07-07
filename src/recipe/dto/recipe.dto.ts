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
      grab: number[];
      gain: [
        {
          distance: number;
          value: number;
        },
      ];
      exposureTime: [
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
