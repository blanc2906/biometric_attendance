import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user_log.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  private userLoginStatus: Map<number, boolean> = new Map();

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @MessagePattern('user_topic')
  async getNotifications(@Payload() data: string, @Ctx() context: MqttContext) {
    
    const userId = await this.usersService.findUserByFingerID(Number(data));
    try {
      const user: User = await this.usersService.findOne(userId);
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
      } else {
        const userLog = new UserLog();
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
    } catch (error) {
      this.logger.error(`Error processing user ${userId}: ${error.message}`);
    }
  }
  /*@MessagePattern('create_user')
  async createUser(@Payload() data: string, @Ctx() context: MqttContext) {
    
      const finger_id = Number(data);
      const createUserDto = new CreateUserDto();
      createUserDto.name = 'New User'; 
      createUserDto.finger_id = finger_id;
      const newUser = await this.usersService.create(createUserDto);
      this.logger.log(`Created new user with ID ${newUser.id} for finger ID ${finger_id}`);
  }*/
}
