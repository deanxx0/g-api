import { RecipeDto } from './glovis.recipe.dto';
import { VehicleDto } from './vehicle.dto';

export class InspectionDto {
  _id: string;
  vehicle: VehicleDto; //vincode로 조회된 차량정보
  recipe: RecipeDto; //차량모델,색상으로 조회된 recipe
  status: string;
  inferenceResults: [
    {
      camera: string;
      grab: {
        seq: number;
        distance: number;
      };
      defects: [
        {
          x: number;
          y: number;
          resultCode: number;
        },
      ];
    },
  ];
  createdAt: string;
  updatedAt: string;
}
