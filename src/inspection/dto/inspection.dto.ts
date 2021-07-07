import { RecipeDto } from "src/recipe/dto/recipe.dto";
import { VehicleDto } from "src/vehicle/dto/vehicle.dto";

export class InspectionDto {
  vehicle: VehicleDto;
  recipe: RecipeDto;
  status: string;
  inferenceResults:[
  {
    camera:string;
    grab:{ 
      seq:number;
      distance:number
    },
    defects:[
    {
      x:number;
      y:number;
      resultCode:number
      },
    ]
  }
  ]
}