import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModule } from './vehicle/vehicle.module';
import { RecipeModule } from './recipe/recipe.module';
import { InspectionModule } from './inspection/inspection.module';
import { CameraModule } from './camera/camera.module';
import { ConfigModule } from '@nestjs/config';

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
  ],
})
export class AppModule {}
