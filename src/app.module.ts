import { Module } from '@nestjs/common';
import { VehicleModule } from './glovis/vehicle.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db-admin:laon0118@10.30.2.106:27017/st_db?authSource=admin'),
    VehicleModule,
  ],
})
export class AppModule {}
