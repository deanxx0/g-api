import { Module } from '@nestjs/common';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { ConnectorController } from './connector.controller';
import { ConnectorService } from './connector.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inspection,
  InspectionSchema,
} from 'src/inspection/schema/inspection.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
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
          consumeFromBeginning: true,
        },
      },
    ]),
  ],
  controllers: [ConnectorController],
  providers: [ConnectorService],
})
export class ConnectorModule {}
