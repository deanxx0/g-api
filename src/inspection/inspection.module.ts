import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '@dean/nestjs-kafka';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';
import { Inspection, InspectionSchema } from './schema/inspection.schema';
import { Log, LogSchema } from '../log/schema/log.schema';
import {
  InspectionResult,
  InspectionResultSchema,
} from '../inspectionResult/schema/inspection-result.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
      { name: InspectionResult.name, schema: InspectionResultSchema },
      { name: Log.name, schema: LogSchema },
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
