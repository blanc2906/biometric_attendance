import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExcelExportService {
    constructor(private readonly userService: UsersService) {}
    async downloadExcel(): Promise<string> {
        const data = await this.userService.populateData();
        if (!data || data.length === 0) {
            throw new NotFoundException("No data available");
        }

        const rows = data.map(doc => Object.values(doc));
        const workbook = new Workbook();
        const sheet = workbook.addWorksheet('sheet1');

        // Add headers
        rows.unshift(Object.keys(data[0]));
        sheet.addRows(rows);
        this.styleSheet(sheet);

        const downloadPath = join(process.env.USERPROFILE || '', 'Downloads', 'MyExcelSheet.xlsx');

        try {
            await workbook.xlsx.writeFile(downloadPath);
        } catch (error) {
            throw new BadRequestException(`Error writing Excel file: ${error.message}`);
        }

        return downloadPath;
    }

    
    private styleSheet(sheet){
        sheet.getColumn(1).width = 5.5
        sheet.getColumn(2).width = 15.5
        sheet.getColumn(3).width = 15.5

        sheet.getRow(1).height = 30.5

        sheet.getRow(1).font = {size: 11.5, bold: true, color: {argb:'FFFFFF' }}

        sheet.getRow(1).fill = {type: `pattern`, pattern: `solid`, bgColor: {argb: '000000', fgColor: { argb: '000000'}}}
        sheet.getRow(1).alignment = {vertical: 'middle', horizonal: "center", wrapText: true}

        sheet.getRow(1). border = {
            top: {style: 'thin', color: {argb: '000000'}},
            left: {style: 'thin', color: {argb: 'FFFFFF'}},
            bottom: {style: 'thin', color: {argb: '000000'}},
            right: {style: 'thin', color: {argb: 'FFFFFF'}}
        };
    }
}
