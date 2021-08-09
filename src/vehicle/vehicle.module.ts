import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleSchema } from './schema/vehicle.schema';
import {
  VehicleModel,
  VehicleModelSchema,
} from 'src/vehicleModel/schema/vehicle-model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    MongooseModule.forFeature([
      { name: VehicleModel.name, schema: VehicleModelSchema },
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
