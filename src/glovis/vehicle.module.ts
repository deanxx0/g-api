import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleSchema } from './schma/glovis.vehicle.schma';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema }
    ])
  ],
  controllers: [VehicleController],
  providers: [VehicleService]
})
export class VehicleModule {}
