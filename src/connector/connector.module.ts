import { Module } from '@nestjs/common';
import { KafkaModule } from '@dean/nestjs-kafka';
import { ConnectorController } from './connector.controller';
import { ConnectorService } from './connector.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inspection,
  InspectionSchema,
} from 'src/inspection/schema/inspection.schema';
import { Sensor, SensorSchema } from 'src/sensor/schema/sensor.schema';
import { Camera, CameraSchema } from 'src/camera/schema/camera.schema';
import { Light, LightSchema } from 'src/light/schema/light.schema';
import { ResultInfo, ResultInfoSchema } from 'src/resultInfo/schema/result-info.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
      { name: Sensor.name, schema: SensorSchema },
      { name: Camera.name, schema: CameraSchema },
      { name: Light.name, schema: LightSchema },
      { name: ResultInfo.name, schema: ResultInfoSchema },
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
