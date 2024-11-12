import { UserLog } from "./user_log.entity";
import { FaceDescriptor } from "./face-descriptor.entity";
export declare class User {
    id: number;
    name: string;
    finger_id: number;
    userlog: UserLog[];
    faceDescriptor: FaceDescriptor;
}
