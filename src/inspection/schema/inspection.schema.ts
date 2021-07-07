import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { RecipeDto } from "src/recipe/dto/recipe.dto";
import { VehicleDto } from "src/vehicle/dto/vehicle.dto";

export type InspectionDocument = Inspection & Document;

@Schema()
export class Inspection {
  @Prop()
  vehicle: VehicleDto;

  @Prop()
  recipe: RecipeDto;

  @Prop()
  status: string;

  @Prop(raw(
    [
      {
        camera:{ type: String },
        grab:{ 
          seq:{ type: Number },
          distance:{ type: Number }
        },
        defects:[
        {
          x:{ type: Number },
          y:{ type: Number },
          resultCode:{ type: Number }
          },
        ]
      },
    ]
  ))
  inferenceResults: Record<string, any>;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);