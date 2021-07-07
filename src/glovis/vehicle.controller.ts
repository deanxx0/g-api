import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { VehicleDto } from './dto/glovis.vehicle.dto';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './schma/glovis.vehicle.schma';

@Controller('glovis')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Get('vehicles')
  async findAllVehicles(): Promise<Vehicle[]> {
    //throw new ForbiddenException();
    return this.vehicleService.findAllVehicles();
  }

  @Get('vehicle/:id')
  async findVehicle(@Param('id') id: string): Promise<Vehicle> {
    return this.vehicleService.findVehicle(id);
  }

  @Post('vehicle')
  async create(@Body() vehicleDto: VehicleDto) {
    this.vehicleService.create(vehicleDto);
  }

  @Put('vehicle/:id')
  async update(@Param('id') id: string, @Body() vehicleDto: VehicleDto) {
    this.vehicleService.update(id, vehicleDto);
  }

  @Delete('vehicle/:id')
  async delete(@Param('id') id: string) {
    this.vehicleService.delete(id);
  }
}
