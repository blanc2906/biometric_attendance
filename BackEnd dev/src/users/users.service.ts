import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user_log.entity';
import { Repository } from 'typeorm';
import { CreateUserLogDto } from './dto/create-user_log.dto';
import { UpdateUserLogDto } from './dto/update-user_log.entity';
import { MqttService } from 'src/mqtt/mqtt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    private readonly mqttService: MqttService
  ) {}

  private async findUserOrThrow(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.mqttService.publish('create_user', 'create new user');
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Failed to publish create_user message:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.findUserOrThrow(id);
  }

  async findUserByFingerID(finger_id: number): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: { finger_id }
    });
    if (!user) {
      throw new NotFoundException(`User with Finger ID ${finger_id} not found`);
    }
    return user.id;
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ 
      where: { id }, 
      relations: ['userlog'] 
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userLogRepository.delete({ user: { id } });

    await this.usersRepository.delete(id);
    
    try {
      await this.mqttService.publish('delete_user', user.finger_id.toString());
    } catch (error) {
      console.error('Failed to publish delete_user message:', error);
    }
  }

  async saveUserLog(userId: number, createUserLogDto: CreateUserLogDto): Promise<UserLog> {
    const user = await this.findUserOrThrow(userId);
    const userLog = this.userLogRepository.create({
      user,
      ...createUserLogDto
    });
    return await this.userLogRepository.save(userLog);
  }

  async updateUserLog(userId: number, date: Date, time_in: string, updateUserLogDto: UpdateUserLogDto): Promise<UserLog> {
    const user = await this.findUserOrThrow(userId);
    const userLog = await this.userLogRepository.findOne({
      where: { user, date, time_in }
    });
    if (!userLog) {
      throw new NotFoundException(`User log not found`);
    }
    Object.assign(userLog, updateUserLogDto);
    return await this.userLogRepository.save(userLog);
  }

  async getLatestUserLog(userId: number): Promise<UserLog | null> {
    const logs = await this.userLogRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC', time_in: 'DESC' },
      take: 1,
    });
    return logs[0] || null;
  }

  async populateData(): Promise<any[]> {
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
}
