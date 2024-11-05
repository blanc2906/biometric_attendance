import { User } from "./user.entity";
export declare class UserLog {
    id: number;
    date: Date;
    time_in: string;
    time_out: string;
    user: User;
}
