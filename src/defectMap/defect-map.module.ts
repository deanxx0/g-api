import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InferenceResult,
  InferenceResultSchema,
} from 'src/inferenceResult/schema/inference-result.schema';
import { DefectMapController } from './defect-map.controller';
import { DefectMapService } from './defect-map.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InferenceResult.name, schema: InferenceResultSchema },
    ]),
  ],
  controllers: [DefectMapController],
  providers: [DefectMapService],
})
export class DefectMapModule {}
