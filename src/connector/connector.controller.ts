import { Controller, Inject } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { ConnectorService } from './connector.service';

const topicInspectionCreated = 'glovis.fct.inspectionCreated';

@Controller()
export class ConnectorController {
  constructor(
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
    private connectorService: ConnectorService,
  ) {}

  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(topicInspectionCreated, this);
  }

  @SubscribeTo(topicInspectionCreated)
  async getInspectionCreated(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    console.log(`[${offset}]${key} : ${data}`);
    this.connectorService.updateInspectionStatus();
  }
}
