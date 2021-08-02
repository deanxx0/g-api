import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InferenceResult,
  InferenceResultSchema,
} from 'src/connector/schema/inference-result.schema';
import { InferenceResultController } from './inference-result.controller';
import { InferenceResultService } from './inference-result.service';

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
