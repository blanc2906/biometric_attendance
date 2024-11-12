import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FaceDescriptor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    descriptor: number[];

    @OneToOne(() => User, user => user.faceDescriptor)
    @JoinColumn()
    user: User;
}