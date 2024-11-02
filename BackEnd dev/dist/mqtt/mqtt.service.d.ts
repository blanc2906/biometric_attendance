import { ClientProxy } from '@nestjs/microservices';
export declare class MqttService {
    private readonly client;
    private readonly logger;
    onModuleInit(): void;
    constructor(client: ClientProxy);
    publish(topic: string, message: string): Promise<void>;
}
