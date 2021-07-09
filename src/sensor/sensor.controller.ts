import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { PostSensorDto } from './dto/post-sensor.dto';
import { SensorDocument } from './schema/sensor.schema';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Post()
  async create(@Body() postSensorDto: PostSensorDto): Promise<SensorDocument> {
    return this.sensorService.create(this.toCreateDto(postSensorDto));
  }

  @Get()
  async findAll(): Promise<SensorDocument[]> {
    return this.sensorService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<SensorDocument> {
    return this.sensorService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postSensorDto: PostSensorDto,
  ): Promise<SensorDocument> {
    return this.sensorService.update(id, this.toCreateDto(postSensorDto));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SensorDocument> {
    return this.sensorService.delete(id);
  }

  private toCreateDto(postSensorDto: PostSensorDto): CreateSensorDto {
    return {
      name: postSensorDto.name,
      groups: postSensorDto.groups,
      status: postSensorDto.status,
    };
  }
}
