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
exports.Person = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
let Person = class Person extends BaseEntity_1.BaseEntity {
    // @BeforeUpdate()
    cleanupBirthDateValue() {
        console.log("******", this.birthDate);
        if (this.birthDate != null) {
            const parsed = /^([^T]+)T.*$/.exec(this.birthDate);
            if (parsed == null) {
                this.birthDate = null;
            }
            else {
                this.birthDate = parsed[1];
            }
        }
    }
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "date",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Person.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)()
    // @BeforeUpdate()
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Person.prototype, "cleanupBirthDateValue", null);
Person = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(["firstName", "lastName"], { unique: true })
], Person);
exports.Person = Person;
