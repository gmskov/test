"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validatePassword = exports.generatePasswordHash = exports.getPasswordHash = void 0;
const crypto = __importStar(require("crypto"));
const db_1 = require("../../db");
const User_1 = require("../../entities/User");
const Password_1 = require("../../entities/Password");
const HASH_ALGO = "SHA256";
function getPasswordHash(password, salt) {
    return crypto
        .createHash(HASH_ALGO)
        .update(password + salt, "utf-8")
        .digest("base64");
}
exports.getPasswordHash = getPasswordHash;
function generatePasswordHash(password) {
    const salt = crypto.randomBytes(32).toString("base64");
    const hash = getPasswordHash(password, salt);
    return { salt, hash };
}
exports.generatePasswordHash = generatePasswordHash;
function validatePassword(login, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const ds = yield db_1.dsPromise;
        const user = yield ds.getRepository(User_1.User).findOneBy({ login });
        if (user == null) {
            console.log("User not found");
            return null;
        }
        const pwd = yield ds.getRepository(Password_1.Password).findOneBy({ user_id: user.id });
        if (pwd == null) {
            console.log("Password not found");
            return null;
        }
        const testHash = getPasswordHash(password, pwd.salt);
        if (testHash !== pwd.hash) {
            console.log("Hashes do not match");
            return null;
        }
        else {
            return user;
        }
    });
}
exports.validatePassword = validatePassword;
