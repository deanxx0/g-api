import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '@dean/nestjs-kafka';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';
import { Inspection, InspectionSchema } from './schema/inspection.schema';
import {
  InspectionLog,
  InspectionLogSchema,
} from '../inspectionLog/schema/inspection-log.schema';
import {
  InspectionResult,
  InspectionResultSchema,
} from '../inspectionResult/schema/inspection-result.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
      { name: InspectionLog.name, schema: InspectionLogSchema },
      { name: InspectionResult.name, schema: InspectionResultSchema },
      { name: InspectionLog.name, schema: InspectionLogSchema },
    ]),
    KafkaModule.register([
      {
        name: 'KAFKA-CONNECTOR',
        options: {
          client: {
            clientId: 'master-api-service',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'master-api-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}
