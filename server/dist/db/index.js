"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepository = exports.dsPromise = void 0;
const typeorm_1 = require("typeorm");
const Person_1 = require("../entities/Person");
const EmployeeProfile_1 = require("../entities/EmployeeProfile");
const EmployeeSalary_1 = require("../entities/EmployeeSalary");
const Invoice_1 = require("../entities/Invoice");
const File_1 = require("../entities/File");
const User_1 = require("../entities/User");
const GProUser_1 = require("../entities/GProUser");
const Password_1 = require("../entities/Password");
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "167.71.39.235",
    username: "postgres",
    password: "postgres",
    database: "gbar_test",
    entities: [
        Person_1.Person,
        EmployeeProfile_1.EmployeeProfile,
        EmployeeSalary_1.EmployeeSalary,
        Invoice_1.Invoice,
        File_1.File,
        User_1.User,
        GProUser_1.GProUser,
        Password_1.Password
    ],
    // logging: true,
    synchronize: true,
    // dateStrings: ["date"],
    // supportBigNumbers: true,
});
exports.dsPromise = dataSource.initialize();
function getRepository(target) {
    return __awaiter(this, void 0, void 0, function* () {
        const ds = yield exports.dsPromise;
        return ds.getRepository(target);
    });
}
exports.getRepository = getRepository;
