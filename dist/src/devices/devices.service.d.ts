import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/createDevice.dto';
export declare class DevicesService {
    private deviceRepository;
    constructor(deviceRepository: Repository<Device>);
    getAllDevices(): Promise<Device[]>;
    getDeviceById(deviceId: string): Promise<Device>;
    createDevice(createDeviceDto: CreateDeviceDto): Promise<Device>;
}
