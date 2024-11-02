import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/createDevice.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)  
    private deviceRepository: Repository<Device>,
  ) {}

  async getAllDevices() {
    return await this.deviceRepository.find();  
  }

  async getDeviceById(deviceId: string) {
    const device = await this.deviceRepository.findOne({ where: { deviceId } });
    if (!device) {
      throw new HttpException('device not found', HttpStatus.NOT_FOUND);
    }
    return device;
  }

  async createDevice(createDeviceDto: CreateDeviceDto) {
    const newDevice = this.deviceRepository.create(createDeviceDto); 
    await this.deviceRepository.save(newDevice); 
    return newDevice;
  }
}
