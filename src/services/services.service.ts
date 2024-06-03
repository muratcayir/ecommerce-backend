import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(service: Service): Promise<Service> {
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  async findOne(id: number): Promise<Service> {
    return this.servicesRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Service>): Promise<Service> {
    await this.servicesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.servicesRepository.delete(id);
  }
}
