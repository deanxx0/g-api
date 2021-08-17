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
import { LogService } from './log.service';
import { LogDocument } from './schema/log.schema';

@Controller('log')
export class LogController {
  constructor(private LogService: LogService) {}

  @Get('filter')
  async findByFilter(@Query() query: any): Promise<LogDocument[]> {
    return this.LogService.findByFilter(query.from, query.to, query.type);
  }

  @Get('type-list')
  async getTypeList(): Promise<Object> {
    return {
      types: ['all', 'INFO', 'WARNING', 'ERROR'],
    };
  }

  @Get()
  async findAll(): Promise<LogDocument[]> {
    return this.LogService.findAll();
  }

  @Get('limit-desc')
  async findAllLimitDesc(@Query() query: any): Promise<LogDocument[]> {
    return this.LogService.findAllLimitDesc(query.limit);
  }

  @Get('latest')
  async findLatest(): Promise<LogDocument> {
    return this.LogService.findLatest();
  }
}
