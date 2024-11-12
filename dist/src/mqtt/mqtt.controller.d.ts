import { ClientMqtt, MqttContext } from '@nestjs/microservices';
import { PublishMessageDto } from './dto/publish.dto';
export declare class MqttController {
    private readonly client;
    private readonly logger;
    constructor(client: ClientMqtt);
    publishMessage(publishMessageDto: PublishMessageDto): Promise<void>;
    getNotifications(data: string, context: MqttContext): void;
}
