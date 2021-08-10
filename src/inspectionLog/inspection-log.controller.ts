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
import { InspectionLogService } from './inspection-log.service';
import { InspectionLogDocument } from './schema/inspection-log.schema';

@Controller('inspection-log')
export class InspectionLogController {
  constructor(private inspectionLogService: InspectionLogService) {}

  @Get('filter')
  async findByFilter(@Query() query: any): Promise<InspectionLogDocument[]> {
    return this.inspectionLogService.findByFilter(
      query.from,
      query.to,
      query.type,
    );
  }

  @Get('type-list')
  async getTypeList(): Promise<String[]> {
    return ['all', 'INFO', 'WARNING', 'ERROR'];
  }

  @Get()
  async findAll(): Promise<InspectionLogDocument[]> {
    return this.inspectionLogService.findAll();
  }

  @Get('limit-desc')
  async findAllLimitDesc(
    @Query() query: any,
  ): Promise<InspectionLogDocument[]> {
    return this.inspectionLogService.findAllLimitDesc(query.limit);
  }

  @Get('latest')
  async findLatest(): Promise<InspectionLogDocument> {
    return this.inspectionLogService.findLatest();
  }
}
