import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserLog } from "./user_log.entity";
import { FaceDescriptor } from "./face-descriptor.entity";

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

    @OneToOne(() => FaceDescriptor, faceDescriptor => faceDescriptor.user, { 
        cascade: true,
        onDelete: 'CASCADE' 
    })
    faceDescriptor: FaceDescriptor;
}
