import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { PostModelDto } from './dto/post-model.dto';
import { ModelService } from './model.service';
import { ModelDocument } from './schema/model.schema';

@Controller('model')
export class ModelController {
  constructor(private modelService: ModelService) {}

  @Post()
  async create(@Body() postModelDto: PostModelDto): Promise<ModelDocument> {
    return this.modelService.create(this.toCreateDto(postModelDto));
  }

  @Get()
  async findAll(): Promise<ModelDocument[]> {
    return this.modelService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ModelDocument> {
    return this.modelService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postModelDto: PostModelDto,
  ): Promise<ModelDocument> {
    return this.modelService.update(id, this.toCreateDto(postModelDto));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ModelDocument> {
    return this.modelService.delete(id);
  }

  private toCreateDto(postModelDto: PostModelDto): CreateModelDto {
    return {
      model: postModelDto.model,
    };
  }
}
