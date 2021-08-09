import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { PostVehicleModelDto } from './dto/post-vehicle-model.dto';
import { VehicleModelDocument } from './schema/vehicle-model.schema';
import { VehicleModelService } from './vehicle-model.service';

@Controller('vehicle-model')
export class VehicleModelController {
  constructor(private vehicleModelService: VehicleModelService) {}

  @Post()
  async create(
    @Body() postVehicleModelDto: PostVehicleModelDto,
  ): Promise<VehicleModelDocument> {
    return this.vehicleModelService.create(
      this.toCreateDto(postVehicleModelDto),
    );
  }

  @Get()
  async findAll(): Promise<VehicleModelDocument[]> {
    return this.vehicleModelService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<VehicleModelDocument> {
    return this.vehicleModelService.find(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postVehicleModelDto: PostVehicleModelDto,
  ): Promise<VehicleModelDocument> {
    return this.vehicleModelService.update(
      id,
      this.toCreateDto(postVehicleModelDto),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<VehicleModelDocument> {
    return this.vehicleModelService.delete(id);
  }

  private toCreateDto(
    postVehicleModelDto: PostVehicleModelDto,
  ): CreateVehicleModelDto {
    return {
      model: postVehicleModelDto.model,
    };
  }
}
