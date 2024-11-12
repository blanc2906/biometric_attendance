import { Controller, Logger, Post, Body, Inject } from '@nestjs/common';
import { ClientMqtt, ClientProxy, Ctx, EventPattern, MessagePattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { PublishMessageDto } from './dto/publish.dto';
import { lastValueFrom } from 'rxjs';

@Controller('mqtt')
export class MqttController {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    @Inject('MQTT_CLIENT') private readonly client: ClientMqtt,
  ) {}

  @Post('publish')
  async publishMessage(@Body() publishMessageDto: PublishMessageDto) {
    try {
      await lastValueFrom(
      this.client.emit(publishMessageDto.topic, publishMessageDto.message)
    );
      
    } catch (error) {
      this.logger.error('Failed to publish message', error);
      throw error;
    }
  }

  @MessagePattern('test_topic')
   getNotifications(@Payload() data: string, @Ctx() context: MqttContext) {
  this.logger.log(`Received message from topic ${context.getTopic()}: ${data}`);
  }

}
