import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { VehicleDto } from './dto/glovis.vehicle.dto';
import { GlovisService } from './glovis.service';
import { Vehicle } from './schma/glovis.vehicle.schma';

@Controller('glovis')
export class GlovisController {
  constructor(private glovisService: GlovisService) {}

  @Get('vehicles')
  async findAllVehicles(): Promise<Vehicle[]> {
    throw new ForbiddenException();
    return this.glovisService.findAllVehicles();
  }

  @Get('vehicle/:id')
  async findVehicle(@Param('id') id: string): Promise<Vehicle> {
    return this.glovisService.findVehicle(id);
  }

  @Post('vehicle')
  async create(@Body() vehicleDto: VehicleDto) {
    this.glovisService.create(vehicleDto);
  }

  @Put('vehicle/:id')
  async update(@Param('id') id: string, @Body() vehicleDto: VehicleDto) {
    this.glovisService.update(id, vehicleDto);
  }

  @Delete('vehicle/:id')
  async delete(@Param('id') id: string) {
    this.glovisService.delete(id);
  }
}
