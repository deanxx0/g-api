import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModule } from './vehicle/vehicle.module';
import { RecipeModule } from './recipe/recipe.module';
import { InspectionModule } from './inspection/inspection.module';
import { CameraModule } from './camera/camera.module';
import { ConfigModule } from '@nestjs/config';
import { LightModule } from './light/light.module';
import { InlineRecipeModule } from './inlineRecipe/inline-recipe.module';
import { SensorModule } from './sensor/sensor.module';
import { ConnectorModule } from './connector/connector.module';
import { InspectionResultModule } from './inspectionResult/inspection-result.module';
import { inferenceResultModule } from './inferenceResult/inference-result.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?authSource=admin`,
    ),
    VehicleModule,
    RecipeModule,
    InspectionModule,
    CameraModule,
    LightModule,
    InlineRecipeModule,
    SensorModule,
    ConnectorModule,
    InspectionResultModule,
    inferenceResultModule,
  ],
})
export class AppModule {}
