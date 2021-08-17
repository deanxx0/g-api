import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateInspectionRecipeDto } from './dto/create-inspection-recipe.dto';
import { PostInspectionRecipeDto } from './dto/post-inspection-recipe.dto';
import { InspectionRecipeDocument } from './schema/inspection-recipe.schema';
import { InspectionRecipeService } from './inspection-recipe.service';

@Controller('inspection-recipe')
export class InspectionRecipeController {
  constructor(private inspectionRecipeService: InspectionRecipeService) {}

  @Post()
  async create(
    @Body() postInspectionRecipeDto: PostInspectionRecipeDto,
  ): Promise<InspectionRecipeDocument> {
    return this.inspectionRecipeService.create(
      this.toCreateDto(postInspectionRecipeDto),
    );
  }

  @Get()
  async findAll(): Promise<InspectionRecipeDocument[]> {
    return this.inspectionRecipeService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<InspectionRecipeDocument> {
    return this.inspectionRecipeService.find(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InspectionRecipeDocument> {
    return this.inspectionRecipeService.delete(id);
  }

  private toCreateDto(
    postInspectionRecipeDto: PostInspectionRecipeDto,
  ): CreateInspectionRecipeDto {
    return {
      name: postInspectionRecipeDto.name,
      size: postInspectionRecipeDto.size,
      area: postInspectionRecipeDto.area,
      limitCountByImage: postInspectionRecipeDto.limitCountByImage,
      limitCountByVehicle: postInspectionRecipeDto.limitCountByVehicle,
      gap: postInspectionRecipeDto.gap,
      differenceColor: postInspectionRecipeDto.differenceColor,
    };
  }
}
