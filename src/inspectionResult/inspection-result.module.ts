import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectionResultController } from './inspection-result.controller';
import { InspectionResultService } from './inspection-result.service';
import {
  InspectionResult,
  InspectionResultSchema,
} from './schema/inspection-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InspectionResult.name, schema: InspectionResultSchema },
    ]),
  ],
  controllers: [InspectionResultController],
  providers: [InspectionResultService],
})
export class InspectionResultModule {}
