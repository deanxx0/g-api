import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { VehicleDto } from './dto/vehicle.dto';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './schema/vehicle.schema';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Get()
  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.findAllVehicles();
  }

  @Get(':id')
  async findVehicle(@Param('id') id: string): Promise<Vehicle> {
    return this.vehicleService.findVehicle(id);
  }

  @Post()
  async create(@Body() vehicleDto: VehicleDto) {
    this.vehicleService.create(vehicleDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() vehicleDto: VehicleDto) {
    this.vehicleService.update(id, vehicleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.vehicleService.delete(id);
  }
}
