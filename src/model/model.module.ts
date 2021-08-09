import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { ModelSchema } from './schema/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
  controllers: [ModelController],
  providers: [ModelService],
})
export class SensorModule {}
