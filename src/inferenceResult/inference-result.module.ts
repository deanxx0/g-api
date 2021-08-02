import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InferenceResultController } from './inference-result.controller';
import { InferenceResultService } from './inference-result.service';
import {
  InferenceResult,
  InferenceResultSchema,
} from './schema/inference-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InferenceResult.name, schema: InferenceResultSchema },
    ]),
  ],
  controllers: [InferenceResultController],
  providers: [InferenceResultService],
})
export class inferenceResultModule {}
