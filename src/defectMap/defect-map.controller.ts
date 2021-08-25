import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InferenceResultDocument } from 'src/inferenceResult/schema/inference-result.schema';
import { DefectMapService } from './defect-map.service';

@Controller('defect-map')
export class DefectMapController {
  constructor(private defectMapService: DefectMapService) {}

  @Get()
  async findAll(): Promise<InferenceResultDocument[]> {
    return this.defectMapService.findAll();
  }

  @Get('id')
  async findById(@Query() query: any): Promise<InferenceResultDocument> {
    return this.defectMapService.findById(query.id);
  }

  @Get('list')
  async getList(@Query() query: any) {
    return this.defectMapService.getList(query.inspectionId, query.cameraName);
  }
}
