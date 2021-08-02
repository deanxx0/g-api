import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectionLogController } from './inspection-log.controller';
import { InspectionLogService } from './inspection-log.service';
import {
  InspectionLog,
  InspectionLogSchema,
} from './schema/inspection-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InspectionLog.name, schema: InspectionLogSchema },
    ]),
  ],
  controllers: [InspectionLogController],
  providers: [InspectionLogService],
})
export class InspectionLogModule {}
