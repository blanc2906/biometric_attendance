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
const data_1 = require("../excel-export/data");
let UsersService = class UsersService {
    constructor(usersRepository, userLogRepository) {
        this.usersRepository = usersRepository;
        this.userLogRepository = userLogRepository;
    }
    async create(createUserDto) {
        const user = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(user);
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async findOne(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
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
    async update(id, updateUserDto) {
        await this.findOne(id);
        await this.usersRepository.update(id, updateUserDto);
        return await this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.usersRepository.delete(id);
    }
    async saveUserLog(userId, createUserLogDto) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const userLog = this.userLogRepository.create({
            user: user,
            date: createUserLogDto.date,
            time_in: createUserLogDto.time_in,
            time_out: createUserLogDto.time_out,
        });
        return await this.userLogRepository.save(userLog);
    }
    async updateUserLog(userId, date, time_in, updateUserLogDto) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        const userLog = await this.userLogRepository.findOne({
            where: { user, date, time_in }
        });
        userLog.time_out = updateUserLogDto.time_out;
        return await this.userLogRepository.save(userLog);
    }
    async getLatestUserLog(userId) {
        const logs = await this.userLogRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC', time_in: 'DESC' },
            take: 1,
        });
        return logs.length > 0 ? logs[0] : null;
    }
    async populateData() {
        const userLogs = await this.userLogRepository.find({
            relations: ['user'],
        });
        data_1.data.length = 0;
        data_1.data.push(...userLogs.map((log) => ({
            id: log.user.id.toString(),
            name: log.user.name,
            date: log.date.toString(),
            time_in: log.time_in,
            time_out: log.time_out || "",
        })));
        return data_1.data;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_log_entity_1.UserLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map