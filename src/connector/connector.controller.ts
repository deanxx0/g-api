import { Controller, Inject } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@dean/nestjs-kafka';
import { ConnectorService } from './connector.service';
import { CreateInferenceResultDto } from './dto/create-inference-result.dto';
import { PostInferenceResultDto } from './dto/post-inference-result.dto';
import { InspectionStatus } from './enum/inspection-status';

const topicBeginInspection = 'glovis.fct.beginInspection';
const topicInferenceResult = 'glovis.fct.inferenceResult';
const topicEndInspection = 'glovis.fct.endInspection';
const topicSensorStatus = 'glovis.fct.sensorStatus';
const topicCameraStatus = 'glovis.fct.cameraStatus';
const topicLightStatus = 'glovis.fct.lightStatus';

@Controller()
export class ConnectorController {
  constructor(
    @Inject('KAFKA-CONNECTOR') private kafkaService: KafkaService,
    private connectorService: ConnectorService,
  ) {}

  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(topicBeginInspection, this);
    this.kafkaService.subscribeToResponseOf(topicInferenceResult, this);
    this.kafkaService.subscribeToResponseOf(topicEndInspection, this);
    this.kafkaService.subscribeToResponseOf(topicSensorStatus, this);
    this.kafkaService.subscribeToResponseOf(topicCameraStatus, this);
    this.kafkaService.subscribeToResponseOf(topicLightStatus, this);
  }

  @SubscribeTo(topicLightStatus)
  async getLightStatus(data: any, key: any, offset: number, timestamp: number) {
    //console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);
    this.connectorService.updateLightStatus(data.light, data.status);
  }

  @SubscribeTo(topicCameraStatus)
  async getCameraStatus(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    //console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);
    this.connectorService.updateCameraStatus(data.camera, data.status);
  }

  @SubscribeTo(topicSensorStatus)
  async getSensorStatus(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    //console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);
    this.connectorService.updateSensorStatus(data.sensor, data.status);
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
    console.log(`getInferenceResult [${offset}]${key} : ${data} : ${timestamp}`);
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

  @SubscribeTo(topicEndInspection)
  async getEndInspection(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    console.log(`[${offset}]${key} : ${data} : ${timestamp}`);
    data = JSON.parse(data);
    this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.EndInspection,
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
