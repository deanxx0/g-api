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
import { InferenceResultService } from './inference-result.service';
import { InferenceResultDocument } from './schema/inference-result.schema';

@Controller('inference-result')
export class InferenceResultController {
  constructor(private inferenceResultService: InferenceResultService) {}

  @Get('inspection-id')
  async findByInspectionId(
    @Query() query: any,
  ): Promise<InferenceResultDocument[]> {
    return this.inferenceResultService.findByInspectionId(query.id);
  }

  @Get('inspection-id/defects')
  async getDefectsByInspectionId(
    @Query() query: any,
  ): Promise<InferenceResultDocument[]> {
    return this.inferenceResultService.getDefectsByInspectionId(query.id);
  }

  @Get('inspection-id/camera')
  async findByInspectionIdAndCamera(
    @Query() query: any,
  ): Promise<InferenceResultDocument[]> {
    return this.inferenceResultService.findByInspectionIdAndCamera(
      query.id,
      query.camera,
    );
  }

  @Get()
  async findAll(): Promise<InferenceResultDocument[]> {
    return this.inferenceResultService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultService.find(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultService.delete(id);
  }
}
