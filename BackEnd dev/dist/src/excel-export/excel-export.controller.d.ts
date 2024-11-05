import { Response } from 'express';
import { ExcelExportService } from './excel-export.service';
export declare class ExcelExportController {
    private readonly excelExportService;
    constructor(excelExportService: ExcelExportService);
    downloadReport(res: Response): Promise<void>;
}
