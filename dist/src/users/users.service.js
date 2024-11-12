"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_log_entity_1 = require("./entities/user_log.entity");
const typeorm_2 = require("typeorm");
const mqtt_service_1 = require("../mqtt/mqtt.service");
let UsersService = class UsersService {
    constructor(usersRepository, userLogRepository, mqttService) {
        this.usersRepository = usersRepository;
        this.userLogRepository = userLogRepository;
        this.mqttService = mqttService;
    }
    async findUserOrThrow(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async initiateUserCreation() {
        try {
            await this.mqttService.publish('create_user', 'create new user');
        }
        catch (error) {
            console.error('Failed to publish create_user message:', error);
            throw error;
        }
    }
    async create(createUserDto) {
        try {
            if (isNaN(createUserDto.finger_id)) {
                throw new Error('Invalid finger_id');
            }
            const existingUser = await this.usersRepository.findOne({
                where: { finger_id: createUserDto.finger_id }
            });
            if (existingUser) {
                throw new Error(`User with finger_id ${createUserDto.finger_id} already exists`);
            }
            const user = this.usersRepository.create(createUserDto);
            return await this.usersRepository.save(user);
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async findOne(id) {
        return await this.findUserOrThrow(id);
    }
    async findUserByFingerID(finger_id) {
        const user = await this.usersRepository.findOne({
            where: { finger_id }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with Finger ID ${finger_id} not found`);
        }
        return user.id;
    }
    async remove(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['userlog']
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        await this.userLogRepository.delete({ user: { id } });
        await this.usersRepository.delete(id);
        try {
            await this.mqttService.publish('delete_user', user.finger_id.toString());
        }
        catch (error) {
            console.error('Failed to publish delete_user message:', error);
        }
    }
    async saveUserLog(userId, createUserLogDto) {
        const user = await this.findUserOrThrow(userId);
        const userLog = this.userLogRepository.create({
            user,
            ...createUserLogDto
        });
        return await this.userLogRepository.save(userLog);
    }
    async updateUserLog(userId, date, time_in, updateUserLogDto) {
        const user = await this.findUserOrThrow(userId);
        const userLog = await this.userLogRepository.findOne({
            where: { user, date, time_in }
        });
        if (!userLog) {
            throw new common_1.NotFoundException(`User log not found`);
        }
        Object.assign(userLog, updateUserLogDto);
        return await this.userLogRepository.save(userLog);
    }
    async getLatestUserLog(userId) {
        const logs = await this.userLogRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC', time_in: 'DESC' },
            take: 1,
        });
        return logs[0] || null;
    }
    async populateData() {
        const userLogs = await this.userLogRepository.find({
            relations: ['user'],
        });
        return userLogs.map((log) => ({
            id: log.user.id.toString(),
            name: log.user.name,
            date: log.date.toString(),
            time_in: log.time_in,
            time_out: log.time_out || "",
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_log_entity_1.UserLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mqtt_service_1.MqttService])
], UsersService);
//# sourceMappingURL=users.service.js.map