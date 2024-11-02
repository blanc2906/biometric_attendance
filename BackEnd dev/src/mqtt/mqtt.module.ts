import { Module } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
          rejectUnauthorized: false,
          subscribeOptions: {qos: 0}
        },
      },
    ]),
  ],
  providers: [MqttService],  
  controllers: [MqttController],
  exports: [ClientsModule],
})
export class MqttModule {} 