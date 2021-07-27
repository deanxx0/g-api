import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResultInfoService } from './result-info.service';
import { ResultInfoDocument } from './schema/result-info.schema';

@Controller('result-info')
export class ResultInfoController {
  constructor(private resultInfoService: ResultInfoService) {}

  @Get()
  async findAll(): Promise<ResultInfoDocument[]> {
    return this.resultInfoService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ResultInfoDocument> {
    return this.resultInfoService.find(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResultInfoDocument> {
    return this.resultInfoService.delete(id);
  }
}
