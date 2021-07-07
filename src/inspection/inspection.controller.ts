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

  @Get('inspections')
  async findAllRecipes(): Promise<Inspection[]> {
    return this.inspectionService.findAllRecipes();
  }

  @Get('inspection/:id')
  async findRecipe(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionService.findRecipe(id);
  }

  @Post('inspection')
  async createRecipe(@Body() inspectionDto: InspectionDto) {
    this.inspectionService.createRecipe(inspectionDto);
  }

  @Put('inspection/:id')
  async updateRecipe(@Param('id') id: string, @Body() inspectionDto: InspectionDto) {
    this.inspectionService.updateRecipe(id, inspectionDto);
  }

  @Delete('inspection/:id')
  async deleteRecipe(@Param('id') id: string) {
    this.inspectionService.deleteRecipe(id);
  }
}
