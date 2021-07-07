import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModule } from './vehicle/vehicle.module';
import { RecipeModule } from './recipe/recipe.module';
import { InspectionModule } from './inspection/inspection.module';
import { CameraModule } from './camera/camera.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://db-admin:laon0118@10.30.2.106:27017/st_db?authSource=admin',
    ),
    VehicleModule,
    RecipeModule,
    InspectionModule,
    CameraModule,
  ],
})
export class AppModule {}
