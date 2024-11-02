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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const microservices_1 = require("@nestjs/microservices");
const user_log_entity_1 = require("./entities/user_log.entity");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_1.Logger(UsersController_1.name);
        this.userLoginStatus = new Map();
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
    async getNotifications(data, context) {
        const userId = await this.usersService.findUserByFingerID(Number(data));
        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                this.logger.error(`User with ID ${userId} not found`);
                return;
            }
            const latestUserLog = await this.usersService.getLatestUserLog(userId);
            const isLoggedIn = this.userLoginStatus.get(userId) || false;
            if (isLoggedIn) {
                if (latestUserLog && !latestUserLog.time_out) {
                    latestUserLog.time_out = new Date().toTimeString().split(' ')[0];
                    this.logger.log(`${user.name} logged out at ${latestUserLog.time_out}`);
                    await this.usersService.updateUserLog(userId, latestUserLog.date, latestUserLog.time_in, { time_out: latestUserLog.time_out });
                }
                this.userLoginStatus.set(userId, false);
            }
            else {
                const userLog = new user_log_entity_1.UserLog();
                userLog.user = user;
                userLog.date = new Date();
                userLog.time_in = new Date().toTimeString().split(' ')[0];
                this.logger.log(`${user.name} logged in at ${userLog.time_in}`);
                await this.usersService.saveUserLog(userId, {
                    date: userLog.date,
                    time_in: userLog.time_in,
                    time_out: null,
                });
                this.userLoginStatus.set(userId, true);
            }
        }
        catch (error) {
            this.logger.error(`Error processing user ${userId}: ${error.message}`);
        }
    }
    async createUser(data, context) {
        const finger_id = Number(data);
        const createUserDto = new create_user_dto_1.CreateUserDto();
        createUserDto.name = 'New User';
        createUserDto.finger_id = finger_id;
        const newUser = await this.usersService.create(createUserDto);
        this.logger.log(`Created new user with ID ${newUser.id} for finger ID ${finger_id}`);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, microservices_1.MessagePattern)('user_topic'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, microservices_1.MqttContext]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getNotifications", null);
__decorate([
    (0, microservices_1.MessagePattern)('create_user'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, microservices_1.MqttContext]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map