import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlovisController } from './glovis.controller';
import { GlovisService } from './glovis.service';
import { Vehicle, VehicleSchema } from './schma/glovis.vehicle.schma';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema }
    ])
  ],
  controllers: [GlovisController],
  providers: [GlovisService]
})
export class GlovisModule {}
