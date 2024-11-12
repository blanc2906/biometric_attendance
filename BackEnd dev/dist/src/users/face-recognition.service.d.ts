import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FaceDescriptor } from './entities/face-descriptor.entity';
import { User } from './entities/user.entity';
export declare class FaceRecognitionService implements OnModuleInit {
    private faceDescriptorRepository;
    private userRepository;
    private modelPath;
    private canvas;
    constructor(faceDescriptorRepository: Repository<FaceDescriptor>, userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    private processImage;
    addFaceDescriptor(userId: number, imagePath: string): Promise<FaceDescriptor>;
    recognizeFace(imagePath: string): Promise<User | null>;
}
