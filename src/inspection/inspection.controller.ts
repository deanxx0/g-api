import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { InspectionDto } from './dto/inspection.dto';
import { InspectionService } from './inspection.service';
import { Inspection } from './schema/inspection.schema';

@Controller('inspection')
export class InspectionController {
  constructor(private inspectionService: InspectionService) {}

  @Get()
  async findAllRecipes(): Promise<Inspection[]> {
    return this.inspectionService.findAllRecipes();
  }

  @Get(':id')
  async findRecipe(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionService.findRecipe(id);
  }

  @Post()
  async createRecipe(@Body() inspectionDto: InspectionDto) {
    this.inspectionService.createRecipe(inspectionDto);
  }

  @Put(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() inspectionDto: InspectionDto,
  ) {
    this.inspectionService.updateRecipe(id, inspectionDto);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    this.inspectionService.deleteRecipe(id);
  }
}
