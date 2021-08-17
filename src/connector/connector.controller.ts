import { Controller, Inject } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@dean/nestjs-kafka';
import { ConnectorService } from './connector.service';
import { CreateInferenceResultDto } from '../inferenceResult/dto/create-inference-result.dto';
import { PostInferenceResultDto } from '../inferenceResult/dto/post-inference-result.dto';
import { InspectionStatus } from './enum/inspection-status';
import { Interval } from '@nestjs/schedule';

const topicBeginInspection = 'glovis.fct.beginInspection';
const topicInferenceResult = 'glovis.fct.inferenceResult';
const topicEndInspection = 'glovis.fct.endInspection';
const topicSensorStatus = 'glovis.fct.sensorStatus';
const topicCameraStatus = 'glovis.fct.cameraStatus';
const topicLightStatus = 'glovis.fct.lightStatus';
const topicLog = 'glovis.fct.log';
const topictimetest = 'glovis.fct.timetest';

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
    this.kafkaService.subscribeToResponseOf(topicLog, this);
    this.kafkaService.subscribeToResponseOf(topictimetest, this);
  }

  @SubscribeTo(topicLog)
  async getLog(data, key, offset, timestamp) {
    data = JSON.parse(data);
    this.connectorService.createLog(data.system, data.type, data.description);
  }

  @SubscribeTo(topictimetest)
  async getTimetest(data) {
    data = JSON.parse(data);
    console.log(data);
    this.connectorService.createTimetest({ num: data.num });
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
    // console.log(`Begin inspection[${offset}]${key} : ${data} : ${timestamp}`);
    console.log(
      `Begin inspection[ offset: ${offset}, key: ${key}, data: ${data}, timestamp: ${timestamp} ]`,
    );
    data = JSON.parse(data);
    await this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.BeginInspection,
    );

    await this.connectorService.updateInspectionResultStatus(
      data.inspection,
      InspectionStatus.BeginInspection,
    );

    await this.connectorService.createInspectionLog(
      data.inspection,
      InspectionStatus.BeginInspection,
    );
  }

  @SubscribeTo(topicEndInspection)
  async getEndInspection(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    // console.log(`End inspection [${offset}]${key} : ${data} : ${timestamp}`);
    console.log(
      `End inspection[ offset: ${offset}, key: ${key}, data: ${data}, timestamp: ${timestamp} ]`,
    );
    data = JSON.parse(data);
    await this.connectorService.updateInspectionStatus(
      data.inspection,
      InspectionStatus.EndInspection,
    );

    await this.connectorService.updateInspectionResultStatus(
      data.inspection,
      InspectionStatus.EndInspection,
    );

    await this.connectorService.updateInspectionResultDefects(data.inspection);

    await this.connectorService.updateInspectionResultTime(data.inspection);

    await this.connectorService.updateInspectionResultFinalResult(
      data.inspection,
    );

    await this.connectorService.createInspectionLog(
      data.inspection,
      InspectionStatus.EndInspection,
    );
  }

  @SubscribeTo(topicInferenceResult)
  async getInferenceResult(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
  ) {
    // console.log(`inference result consumed[ offset: ${offset}, key: ${key}, data: ${data}, timestamp: ${timestamp} ]`);
    data = JSON.parse(data);

    await this.connectorService.pushInferenceResult(
      this.toCreateInferenceResultDto(await data),
    );
  }

  @Interval(1000)
  async handleInterval() {
    this.connectorService.createInferenceResult();
  }

  private toCreateInferenceResultDto(
    PostInferenceResultDto: PostInferenceResultDto,
  ): CreateInferenceResultDto {
    return {
      inspectionId: PostInferenceResultDto.inspection,
      inspectionNo: PostInferenceResultDto.inspectionNo,
      camera: PostInferenceResultDto.camera,
      cameraName: PostInferenceResultDto.cameraName,
      grab: PostInferenceResultDto.grab,
      defects: PostInferenceResultDto.defects,
    };
  }
}
