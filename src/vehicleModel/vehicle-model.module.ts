import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VehicleModel,
  VehicleModelSchema,
} from './schema/vehicle-model.schema';
import { VehicleModelController } from './vehicle-model.controller';
import { VehicleModelService } from './vehicle-model.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleModel.name, schema: VehicleModelSchema },
    ]),
  ],
  controllers: [VehicleModelController],
  providers: [VehicleModelService],
})
export class VehicleModelModule {}
