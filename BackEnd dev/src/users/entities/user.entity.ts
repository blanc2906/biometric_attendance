import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserLog } from "./user_log.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @Column({unique: true})
    finger_id: number;

    @OneToMany(() => UserLog, (userlog) => userlog.user, { cascade: true })
    userlog: UserLog[];
}
