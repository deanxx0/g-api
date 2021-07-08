import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InlineRecipeService } from './inline-recipe.service';
import { PostInlineRecipeDto } from './dto/post-inline-recipe.dto';
import { CreateInlineRecipeDto } from './dto/create-inline-recipe.dto';
import { InlineRecipeDocument } from './schema/inline-recipe.schema';

@Controller('inline-recipe')
export class InlineRecipeController {
  constructor(private inlineRecipeService: InlineRecipeService) {}

  @Post()
  async create(
    @Body() postInlineRecipeDto: PostInlineRecipeDto,
  ): Promise<InlineRecipeDocument> {
    return this.inlineRecipeService.create(
      this.toCreateDto(postInlineRecipeDto),
    );
  }

  @Get()
  async findAll(): Promise<InlineRecipeDocument[]> {
    return this.inlineRecipeService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<InlineRecipeDocument> {
    return this.inlineRecipeService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postInlineRecipeDto: PostInlineRecipeDto,
  ): Promise<InlineRecipeDocument> {
    return this.inlineRecipeService.update(
      id,
      this.toCreateDto(postInlineRecipeDto),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<InlineRecipeDocument> {
    return this.inlineRecipeService.delete(id);
  }

  private toCreateDto(
    postInlineRecipeDto: PostInlineRecipeDto,
  ): CreateInlineRecipeDto {
    return {
      recipe: postInlineRecipeDto.recipe,
      vehicleModel: postInlineRecipeDto.vehicleModel,
      vehicleColor: postInlineRecipeDto.vehicleColor,
    };
  }
}
