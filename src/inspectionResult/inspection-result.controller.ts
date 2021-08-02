import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InspectionResultService } from './inspection-result.service';
import { InspectionResultDocument } from './schema/inspection-result.schema';

@Controller('inspection-result')
export class InspectionResultController {
  constructor(private inspectionResultService: InspectionResultService) {}

  @Get()
  async findAll(): Promise<InspectionResultDocument[]> {
    return this.inspectionResultService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultService.find(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InspectionResultDocument> {
    return this.inspectionResultService.delete(id);
  }
}
