import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user_log.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  private userLoginStatus: Map<number, boolean> = new Map();

  constructor(private readonly usersService: UsersService) {}

  @Post('create_user')
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  private async handleUserLogin(user: User, latestUserLog: UserLog | null): Promise<void> {
    const userLog = new UserLog();
    userLog.user = user;
    userLog.date = new Date();
    userLog.time_in = new Date().toTimeString().split(' ')[0];
    
    this.logger.log(`${user.name} logged in at ${userLog.time_in}`);
    
    await this.usersService.saveUserLog(user.id, {
      date: userLog.date,
      time_in: userLog.time_in,
      time_out: null,
    });
    
    this.userLoginStatus.set(user.id, true);
  }

  private async handleUserLogout(user: User, latestUserLog: UserLog): Promise<void> {
    const time_out = new Date().toTimeString().split(' ')[0];
    this.logger.log(`${user.name} logged out at ${time_out}`);
    
    await this.usersService.updateUserLog(
      user.id, 
      latestUserLog.date, 
      latestUserLog.time_in, 
      { time_out }
    );
    
    this.userLoginStatus.set(user.id, false);
  }

  @MessagePattern('user_topic')
  async getNotifications(@Payload() data: string, @Ctx() context: MqttContext) {
    try {
      const userId = await this.usersService.findUserByFingerID(Number(data));
      const user = await this.usersService.findOne(userId);
      const latestUserLog = await this.usersService.getLatestUserLog(userId);
      const isLoggedIn = this.userLoginStatus.get(userId) || false;

      if (isLoggedIn && latestUserLog && !latestUserLog.time_out) {
        await this.handleUserLogout(user, latestUserLog);
      } else {
        await this.handleUserLogin(user, latestUserLog);
      }
    } catch (error) {
      this.logger.error(`Error processing user: ${error.message}`);
    }
  }

  @MessagePattern('create_user')
  async createUser(@Payload() data: string) {
    try {
      const finger_id = Number(data);
      const newUser = await this.usersService.create({
        name: 'New User',
        finger_id
      });
      this.logger.log(`Created new user with ID ${newUser.id} for finger ID ${finger_id}`);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
    }
  }
}
