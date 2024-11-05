import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MqttContext } from '@nestjs/microservices';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    private userLoginStatus;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    remove(id: string): Promise<void>;
    private handleUserLogin;
    private handleUserLogout;
    getNotifications(data: string, context: MqttContext): Promise<void>;
    createUser(data: string): Promise<void>;
}
