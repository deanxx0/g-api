import { Controller, Inject } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { ConnectorService } from './connector.service';
import { InspectionStatus } from './enum/inspection-status';

const topicBeginInspection = 'glovis.fct.beginInspection';

@Controller()
export class ConnectorController {
  constructor(
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
    private connectorService: ConnectorService,
  ) {}

  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(topicBeginInspection, this);
  }

  @SubscribeTo(topicBeginInspection)
  async getBeginInspection(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    console.log(`[${offset}]${key} : ${data}`);
    data = JSON.parse(data);
    this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.BeginInspection,
    );
  }
}
