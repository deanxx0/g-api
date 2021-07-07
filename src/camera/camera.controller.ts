import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostCameraDto } from './dto/post-camera.dto';
import { CreateCameraDto } from './dto/create-camera.dto';

@Controller('camera')
export class CameraController {
  @Post()
  create(@Body() postCameraDto: PostCameraDto): string {
    return JSON.stringify(postCameraDto);
  }

  @Get()
  findAll(): string {
    return 'find all';
  }

  @Get(':id')
  find(@Param('id') id: string): string {
    return `find ${id}`;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() postCameraDto: PostCameraDto,
  ): string {
    return JSON.stringify(postCameraDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): string {
    return `delete ${id}`;
  }

  private toCreateDto(postCameraDto: PostCameraDto): CreateCameraDto {
    return {
      name: postCameraDto.name,
      group: postCameraDto.group,
      status: postCameraDto.status,
      serial: postCameraDto.serial,
      workingFolderPath: postCameraDto.workingFolderPath,
      type: postCameraDto.type,
      ip: postCameraDto.ip,
      nicIp: postCameraDto.nicIp,
      serverIp: postCameraDto.serverIp,
    };
  }
}
