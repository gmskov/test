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
exports.passwordLoginRoutine = void 0;
const http_errors_1 = require("http-errors");
const password_1 = require("./password");
const jwt_1 = require("./jwt");
function passwordLoginRoutine(loginPayload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = loginPayload;
        if (typeof login !== "string" || typeof password !== "string") {
            throw new http_errors_1.Unauthorized("Invalid or corrupted credentials");
        }
        const user = yield (0, password_1.validatePassword)(login, password);
        if (user == null) {
            throw new http_errors_1.Unauthorized("Invalid login or password");
        }
        return { token: (0, jwt_1.createJwt)(user) };
    });
}
exports.passwordLoginRoutine = passwordLoginRoutine;
