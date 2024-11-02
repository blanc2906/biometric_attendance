import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user_log.entity';
import { Repository } from 'typeorm';
import { CreateUserLogDto } from './dto/create-user_log.dto';
import { UpdateUserLogDto } from './dto/update-user_log.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly userLogRepository;
    constructor(usersRepository: Repository<User>, userLogRepository: Repository<UserLog>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findUserByFingerID(finger_id: number): Promise<number>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    saveUserLog(userId: number, createUserLogDto: CreateUserLogDto): Promise<UserLog>;
    updateUserLog(userId: number, date: Date, time_in: string, updateUserLogDto: UpdateUserLogDto): Promise<UserLog>;
    getLatestUserLog(userId: number): Promise<UserLog | null>;
    populateData(): Promise<{
        id: string;
        name: string;
        date: string;
        time_in: string;
        time_out: string;
    }[]>;
}
