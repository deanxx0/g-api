import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Camera, CameraSchema } from 'src/camera/schema/camera.schema';
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
      { name: Camera.name, schema: CameraSchema },
    ]),
  ],
  controllers: [DefectMapController],
  providers: [DefectMapService],
})
export class DefectMapModule {}
