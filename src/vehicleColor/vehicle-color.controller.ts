import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateVehicleColorDto } from './dto/create-vehicle-color.dto';
import { PostVehicleColorDto } from './dto/post-vehicle-color.dto';
import { VehicleColorDocument } from './schema/vehicle-color.schema';
import { VehicleColorService } from './vehicle-color.service';

@Controller('vehicle-color')
export class VehicleColorController {
  constructor(private vehicleColorService: VehicleColorService) {}

  @Post()
  async create(
    @Body() postVehicleColorDto: PostVehicleColorDto,
  ): Promise<VehicleColorDocument> {
    return this.vehicleColorService.create(
      this.toCreateDto(postVehicleColorDto),
    );
  }

  @Get()
  async findAll(): Promise<VehicleColorDocument[]> {
    return this.vehicleColorService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<VehicleColorDocument> {
    return this.vehicleColorService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postVehicleColorDto: PostVehicleColorDto,
  ): Promise<VehicleColorDocument> {
    return this.vehicleColorService.update(
      id,
      this.toCreateDto(postVehicleColorDto),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<VehicleColorDocument> {
    return this.vehicleColorService.delete(id);
  }

  private toCreateDto(
    postVehicleColorDto: PostVehicleColorDto,
  ): CreateVehicleColorDto {
    return {
      color: postVehicleColorDto.color,
    };
  }
}
