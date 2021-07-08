import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query
} from '@nestjs/common';
import { InspectionDto } from './dto/inspection.dto';
import { InspectionService } from './inspection.service';
import { Inspection } from './schema/inspection.schema';

@Controller('inspection')
export class InspectionController {
  constructor(private inspectionService: InspectionService) {}

  @Get()
  async findAllInspections(): Promise<Inspection[]> {
    return this.inspectionService.findAllInspection();
  }

  @Get('gt')
  async findInspectionsAfterId(@Query() query: any): Promise<Inspection[]> {
    return this.inspectionService.findInspectionsAfterId(query.id, query.limit);
  }

  @Get('inference-results')
  async findInferenceResults(@Query() query: any): Promise<Inspection[]> {
    return this.inspectionService.findInferenceResults(query.id, query.limit);
  }

  @Get(':id')
  async findInspection(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionService.findInspection(id);
  }

  @Post()
  async createInspection(@Body() inspectionDto: InspectionDto) {
    this.inspectionService.createInspection(inspectionDto);
  }

  @Put(':id')
  async updateInspection(
    @Param('id') id: string,
    @Body() inspectionDto: InspectionDto,
  ) {
    this.inspectionService.updateInspection(id, inspectionDto);
  }

  @Delete(':id')
  async deleteInspection(@Param('id') id: string) {
    this.inspectionService.deleteInspection(id);
  }
}
