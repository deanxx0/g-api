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
import { InspectionResultService } from './inspection-result.service';
import { InspectionResultDocument } from './schema/inspection-result.schema';

@Controller('inspection-result')
export class InspectionResultController {
  constructor(private inspectionResultService: InspectionResultService) {}

  @Get('model-color-list')
  async getModelColorList(): Promise<object> {
    return this.inspectionResultService.getModelColorList();
  }

  @Get('inspection-id')
  async getInspectionIdByVincode(@Query() query: any): Promise<String> {
    return this.inspectionResultService.getInspectionIdByVincode(query.vincode);
  }

  @Get('filter')
  async findByFilter(@Query() query: any): Promise<InspectionResultDocument[]> {
    return this.inspectionResultService.findByFilter(
      query.from,
      query.to,
      query.model,
      query.color,
    );
  }

  @Get()
  async findAll(): Promise<InspectionResultDocument[]> {
    return this.inspectionResultService.findAll();
  }

  @Get('limit')
  async findAllLimit(@Query() query: any): Promise<InspectionResultDocument[]> {
    return this.inspectionResultService.findAllLimit(query.limit);
  }

  @Get('period')
  async findPeriod(@Query() query: any): Promise<InspectionResultDocument[]> {
    return this.inspectionResultService.findPeriod(query.from, query.to);
  }

  @Get('latest')
  async findLatest(): Promise<InspectionResultDocument> {
    return this.inspectionResultService.findLatest();
  }

  @Get(':id')
  async findByInspectionId(
    @Param('id') id: string,
  ): Promise<InspectionResultDocument> {
    return this.inspectionResultService.findByInspectionId(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultService.delete(id);
  }
}
