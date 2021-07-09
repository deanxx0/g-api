import { Controller, Inject } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { ConnectorService } from './connector.service';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';
import { PostInferenceResultDto } from './dto/post-inference-result.dto';
import { InspectionStatus } from './enum/inspection-status';

const topicBeginInspection = 'glovis.fct.beginInspection';
const topicInferenceResult = 'glovis.fct.inferenceResult';

@Controller()
export class ConnectorController {
  constructor(
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
    private connectorService: ConnectorService,
  ) {}

  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(topicBeginInspection, this);
    this.kafkaService.subscribeToResponseOf(topicInferenceResult, this);
  }

  @SubscribeTo(topicBeginInspection)
  async getBeginInspection(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);
    this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.BeginInspection,
    );
  }

  @SubscribeTo(topicInferenceResult)
  async getInferenceResult(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);

    this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.Inspecting,
    );

    this.connectorService.updateInspectionInferenceResult(
      data.inspection,
      this.toCreateInferenceResultDto(data),
    );
  }

  private toCreateInferenceResultDto(
    PostInferenceResultDto: PostInferenceResultDto,
  ): CreateInferenceResultDto {
    return {
      camera: PostInferenceResultDto.camera,
      grab: PostInferenceResultDto.grab,
      defects: PostInferenceResultDto.defects,
    };
  }
}
