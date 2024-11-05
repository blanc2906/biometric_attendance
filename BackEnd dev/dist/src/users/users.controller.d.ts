import { UsersService } from './users.service';
import { MqttContext } from '@nestjs/microservices';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    private userLoginStatus;
    constructor(usersService: UsersService);
    create(): Promise<{
        message: string;
    }>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    remove(id: string): Promise<void>;
    private handleUserLogin;
    private handleUserLogout;
    getNotifications(data: string, context: MqttContext): Promise<void>;
    createUser(data: string): Promise<void>;
}
