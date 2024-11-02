import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user_log.entity';
import { Repository } from 'typeorm';
import { CreateUserLogDto } from './dto/create-user_log.dto';
import { UpdateUserLogDto } from './dto/update-user_log.entity';
import { data } from 'src/excel-export/data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findUserByFingerID(finger_id: number){
    const user = await this.usersRepository.findOne({
      where : {finger_id}
    });
    if (!user) {
      throw new NotFoundException(`User with Finger ID ${finger_id} not found`);
    }
    return user.id;

  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }

  async saveUserLog(userId: number, createUserLogDto: CreateUserLogDto): Promise<UserLog> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userLog = this.userLogRepository.create({
        user: user,
        date: createUserLogDto.date,
        time_in: createUserLogDto.time_in,
        time_out: createUserLogDto.time_out,
    });

    return await this.userLogRepository.save(userLog);
  }
  async updateUserLog(userId: number, date: Date, time_in : string, updateUserLogDto: UpdateUserLogDto): Promise<UserLog>{
    const user = await this.usersRepository.findOneBy({id: userId});
    const userLog = await this.userLogRepository.findOne({
      where: {user, date, time_in}
    });
    userLog.time_out = updateUserLogDto.time_out;
    return await this.userLogRepository.save(userLog);
  }
  async getLatestUserLog(userId: number): Promise<UserLog | null> {
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
    data.length = 0; 
    data.push(...userLogs.map((log) => ({
      id: log.user.id.toString(),
      name: log.user.name,
      date: log.date.toString(),
      time_in: log.time_in,
      time_out: log.time_out || "",
    })));
    return data;
  }
  
}
