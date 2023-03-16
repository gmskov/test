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
exports.EmployeeSalary = exports.SalaryBaseUnit = void 0;
const BaseEntity_1 = require("./BaseEntity");
const EmployeeProfile_1 = require("./EmployeeProfile");
const typeorm_1 = require("typeorm");
var SalaryBaseUnit;
(function (SalaryBaseUnit) {
    SalaryBaseUnit["Hour"] = "hour";
    SalaryBaseUnit["Month"] = "month";
})(SalaryBaseUnit = exports.SalaryBaseUnit || (exports.SalaryBaseUnit = {}));
let EmployeeSalary = class EmployeeSalary extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmployeeProfile_1.EmployeeProfile, { nullable: false }),
    __metadata("design:type", EmployeeProfile_1.EmployeeProfile)
], EmployeeSalary.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "date",
        nullable: false,
    }),
    __metadata("design:type", String)
], EmployeeSalary.prototype, "dateEffective", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: SalaryBaseUnit,
        nullable: false,
    }),
    __metadata("design:type", String)
], EmployeeSalary.prototype, "baseUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "decimal",
        nullable: false,
    }),
    __metadata("design:type", Number)
], EmployeeSalary.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        nullable: false
    }),
    __metadata("design:type", Boolean)
], EmployeeSalary.prototype, "net", void 0);
EmployeeSalary = __decorate([
    (0, typeorm_1.Entity)()
], EmployeeSalary);
exports.EmployeeSalary = EmployeeSalary;
