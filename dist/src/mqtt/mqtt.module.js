"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const mqtt_service_1 = require("./mqtt.service");
const mqtt_controller_1 = require("./mqtt.controller");
const dotenv = require("dotenv");
dotenv.config();
let MqttModule = class MqttModule {
};
exports.MqttModule = MqttModule;
exports.MqttModule = MqttModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'MQTT_CLIENT',
                    transport: microservices_1.Transport.MQTT,
                    options: {
                        url: process.env.MQTT_URL,
                        username: process.env.MQTT_USERNAME,
                        password: process.env.MQTT_PASSWORD,
                        rejectUnauthorized: false,
                        subscribeOptions: { qos: 0 }
                    },
                },
            ]),
        ],
        providers: [mqtt_service_1.MqttService],
        controllers: [mqtt_controller_1.MqttController],
        exports: [microservices_1.ClientsModule, mqtt_service_1.MqttService],
    })
], MqttModule);
//# sourceMappingURL=mqtt.module.js.map