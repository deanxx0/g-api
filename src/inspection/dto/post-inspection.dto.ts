import { RecipeDto } from 'src/recipe/dto/recipe.dto';
import { VehicleDto } from 'src/vehicle/dto/vehicle.dto';

export class PostInspectionDto {
  inspectionNo: number;
  vehicle: VehicleDto;
  recipe: RecipeDto;
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
          width: number;
          height: number;
          code: number;
        },
      ];
    },
  ];
}
