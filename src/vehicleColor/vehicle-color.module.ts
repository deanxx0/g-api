import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VehicleColor,
  VehicleColorSchema,
} from './schema/vehicle-color.schema';
import { VehicleColorController } from './vehicle-color.controller';
import { VehicleColorService } from './vehicle-color.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleColor.name, schema: VehicleColorSchema },
    ]),
  ],
  controllers: [VehicleColorController],
  providers: [VehicleColorService],
})
export class VehicleColorModule {}
