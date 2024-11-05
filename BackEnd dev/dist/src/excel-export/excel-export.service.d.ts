import { UsersService } from 'src/users/users.service';
export declare class ExcelExportService {
    private readonly userService;
    constructor(userService: UsersService);
    downloadExcel(): Promise<string>;
    private styleSheet;
}
