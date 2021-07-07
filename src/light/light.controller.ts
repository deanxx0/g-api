import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LightService } from './light.service';
import { PostLightDto } from './dto/post-light.dto';
import { LightDocument } from './schema/light.schema';
import { CreateLightDto } from './dto/create-light.dto';

@Controller('light')
export class LightController {
  constructor(private lightService: LightService) {}

  @Post()
  async create(@Body() postLightDto: PostLightDto): Promise<LightDocument> {
    return this.lightService.create(this.toCreateDto(postLightDto));
  }

  @Get()
  async findAll(): Promise<LightDocument[]> {
    return this.lightService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<LightDocument> {
    return this.lightService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postLightDto: PostLightDto,
  ): Promise<LightDocument> {
    return this.lightService.update(id, this.toCreateDto(postLightDto));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<LightDocument> {
    return this.lightService.delete(id);
  }

  private toCreateDto(postLightDto: PostLightDto): CreateLightDto {
    return {
      name: postLightDto.name,
      group: postLightDto.group,
      status: postLightDto.status,
      workingFolderPath: postLightDto.workingFolderPath,
      serverIp: postLightDto.serverIp,
    };
  }
}
