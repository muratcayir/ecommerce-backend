import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './service.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() service: Service): Promise<Service> {
    return this.servicesService.create(service);
  }

  @Get()
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Service>): Promise<Service> {
    return this.servicesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.servicesService.remove(id);
  }
}
