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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const resource_1 = require("./resource");
const db_1 = require("../db");
const Person_1 = require("../entities/Person");
const EmployeeProfile_1 = require("../entities/EmployeeProfile");
const EmployeeSalary_1 = require("../entities/EmployeeSalary");
const Invoice_1 = require("../entities/Invoice");
const errorHandler_1 = require("./errorHandler");
const auth_1 = require("./auth");
const User_1 = require("../entities/User");
const password_1 = require("./auth/password");
const Password_1 = require("../entities/Password");
const file_1 = require("./file");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use(auth_1.authRouter);
exports.apiRouter.use((0, cookie_parser_1.default)());
//From this point on all further endpoints require authentication
exports.apiRouter.use(auth_1.authMiddleware);
exports.apiRouter.use("/persons", (0, resource_1.Resource)(db_1.dsPromise, Person_1.Person));
exports.apiRouter.use("/employees", (0, resource_1.Resource)(db_1.dsPromise, EmployeeProfile_1.EmployeeProfile, {
    relations: { person: true },
}));
exports.apiRouter.use("/employeeSalary", (0, resource_1.Resource)(db_1.dsPromise, EmployeeSalary_1.EmployeeSalary));
exports.apiRouter.use("/invoices", (0, resource_1.Resource)(db_1.dsPromise, Invoice_1.Invoice, {
    relations: { file: true }
}));
exports.apiRouter.use("/users", (0, resource_1.Resource)(db_1.dsPromise, User_1.User, {
    softDelete: true,
    afterCreate: ({ password }, user, repo, tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = new Password_1.Password();
        Object.assign(payload, Object.assign(Object.assign({}, (0, password_1.generatePasswordHash)(password)), { user_id: user.id }));
        yield tx.getRepository(Password_1.Password).save(payload);
    }),
    afterUpdate: ({ password }, user, repo, tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof password === "string" && password.length > 0) {
            const passwordRepo = tx.getRepository(Password_1.Password);
            let existing = yield passwordRepo.findOneBy({ user_id: user.id });
            if (existing == null) {
                existing = new Password_1.Password();
                existing.user = user;
            }
            Object.assign(existing, (0, password_1.generatePasswordHash)(password));
            yield passwordRepo.save(existing);
        }
    }),
    beforeDelete: (record, repo, tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.getRepository(Password_1.Password).delete({ user_id: record.id });
    })
}));
exports.apiRouter.use("/file", file_1.fileRouter);
exports.apiRouter.use(errorHandler_1.errorHandler);
