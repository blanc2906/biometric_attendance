import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time' })
    time_in: string;

    @Column({ type: 'time', nullable: true })
    time_out: string;

    @ManyToOne(() => User, (user) => user.userlog)
    user: User;
}
