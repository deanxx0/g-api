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
import { CameraService } from './camera.service';
import { Camera, CameraDocument } from './schema/camera.schema';
import { CreateCameraDto } from './dto/create-camera.dto';

@Controller('camera')
export class CameraController {
  constructor(private cameraService: CameraService) {}

  @Post()
  async create(@Body() postCameraDto: PostCameraDto): Promise<Camera> {
    return this.cameraService.create(this.toCreateDto(postCameraDto));
  }

  @Get()
  async findAll(): Promise<Camera[]> {
    return this.cameraService.findAll();
  }

  @Get('serial/:serial')
  async findBySerial(@Param('serial') serial: string): Promise<Camera> {
    return this.cameraService.findBySerial(serial);
  }

  @Get('groups/:groups')
  async findByGroups(@Param('groups') groups: string): Promise<CameraDocument[]> {
    const arrGroups = groups.split(',');
    return this.cameraService.findByGroups(arrGroups);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Camera> {
    return this.cameraService.find(id);
  }  

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postCameraDto: PostCameraDto,
  ): Promise<Camera> {
    return this.cameraService.update(id, this.toCreateDto(postCameraDto));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Camera> {
    return this.cameraService.delete(id);
  }

  private toCreateDto(postCameraDto: PostCameraDto): CreateCameraDto {
    return {
      name: postCameraDto.name,
      groups: postCameraDto.groups,
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
