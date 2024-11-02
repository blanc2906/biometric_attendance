"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelExportService = void 0;
const common_1 = require("@nestjs/common");
const data_1 = require("./data");
const exceljs_1 = require("exceljs");
const path_1 = require("path");
const users_service_1 = require("../users/users.service");
let ExcelExportService = class ExcelExportService {
    constructor(userService) {
        this.userService = userService;
    }
    async downloadExcel() {
        await this.userService.populateData();
        if (!data_1.data || data_1.data.length === 0) {
            throw new common_1.NotFoundException("No data available");
        }
        const rows = data_1.data.map(doc => Object.values(doc));
        const workbook = new exceljs_1.Workbook();
        const sheet = workbook.addWorksheet('sheet1');
        rows.unshift(Object.keys(data_1.data[0]));
        sheet.addRows(rows);
        this.styleSheet(sheet);
        const downloadPath = (0, path_1.join)(process.env.USERPROFILE || '', 'Downloads', 'MyExcelSheet.xlsx');
        try {
            await workbook.xlsx.writeFile(downloadPath);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error writing Excel file: ${error.message}`);
        }
        return downloadPath;
    }
    styleSheet(sheet) {
        sheet.getColumn(1).width = 5.5;
        sheet.getColumn(2).width = 15.5;
        sheet.getColumn(3).width = 15.5;
        sheet.getRow(1).height = 30.5;
        sheet.getRow(1).font = { size: 11.5, bold: true, color: { argb: 'FFFFFF' } };
        sheet.getRow(1).fill = { type: `pattern`, pattern: `solid`, bgColor: { argb: '000000', fgColor: { argb: '000000' } } };
        sheet.getRow(1).alignment = { vertical: 'middle', horizonal: "center", wrapText: true };
        sheet.getRow(1).border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
        };
    }
};
exports.ExcelExportService = ExcelExportService;
exports.ExcelExportService = ExcelExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ExcelExportService);
//# sourceMappingURL=excel-export.service.js.map