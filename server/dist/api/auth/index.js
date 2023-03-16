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
exports.authMiddleware = exports.authRouter = void 0;
const express_1 = require("express");
const http_errors_1 = require("http-errors");
const authHeaderHelper = __importStar(require("auth-header"));
const asyncHandler_1 = require("../asyncHandler");
const jwt_1 = require("./jwt");
const gproLoginRoutine_1 = require("./gproLoginRoutine");
const passwordLoginRoutine_1 = require("./passwordLoginRoutine");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login/:method", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { method } = req.params;
    let result;
    switch (method) {
        case "gpro":
            result = yield (0, gproLoginRoutine_1.gproLoginRoutine)(payload);
            break;
        case "password":
            result = yield (0, passwordLoginRoutine_1.passwordLoginRoutine)(payload);
            break;
        default:
            throw new http_errors_1.Unauthorized(`Unsupported login method`);
    }
    res.cookie("token", result.token, { maxAge: 60 * 60 * 24 * 1000 });
    res.json(result);
})));
exports.authMiddleware = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Try cookies first
    let token = req.cookies.token;
    if (token == null) {
        const authorization = req.header("Authorization");
        if (authorization == null) {
            throw new http_errors_1.Unauthorized("No authorization information found in the request");
        }
        const auth = authHeaderHelper.parse(authorization);
        token = auth.token;
        if (auth.scheme !== "Bearer") {
            throw new http_errors_1.Unauthorized(`Unsupported authorization scheme ${auth.scheme}`);
        }
        if (typeof token !== "string") {
            throw new http_errors_1.Unauthorized("Invalid authorization token");
        }
    }
    const jwtPayload = (0, jwt_1.verifyJwt)(token);
    if (jwtPayload == null) {
        throw new http_errors_1.Unauthorized("Invalid or expired authorization token");
    }
    req.auth = jwtPayload;
    next();
}));
