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
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { PostInspectionDto } from './dto/post-inspection.dto';
import { InspectionService } from './inspection.service';
import { Inspection } from './schema/inspection.schema';

@Controller('inspection')
export class InspectionController {
  constructor(private inspectionService: InspectionService) {}

  @Get()
  async findAll(): Promise<Inspection[]> {
    return this.inspectionService.findAll();
  }

  @Get('after')
  async findAfterId(@Query() query: any): Promise<Inspection[]> {
    return this.inspectionService.findAfterId(query.id, query.limit);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionService.find(id);
  }

  @Post()
  async create(@Body() postInspectionDto: PostInspectionDto) {
    this.inspectionService.create(this.toCreateDto(postInspectionDto));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postInspectionDto: PostInspectionDto,
  ) {
    this.inspectionService.update(id, this.toCreateDto(postInspectionDto));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.inspectionService.delete(id);
  }

  private toCreateDto(postInspectionDto: PostInspectionDto): CreateInspectionDto {
    return {
      inspectionNo: postInspectionDto.inspectionNo,
      vehicle: postInspectionDto.vehicle,
      recipe: postInspectionDto.recipe,
      status: postInspectionDto.status,
      inferenceResults: postInspectionDto.inferenceResults,
    }
  }
}
