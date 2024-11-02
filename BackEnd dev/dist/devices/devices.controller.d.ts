import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/createDevice.dto';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    getAllDevices(): Promise<import("./device.entity").Device[]>;
    getDeviceById(deviceId: string): Promise<import("./device.entity").Device>;
    handlePostRequest(createDeviceDto: CreateDeviceDto): Promise<import("./device.entity").Device>;
}
