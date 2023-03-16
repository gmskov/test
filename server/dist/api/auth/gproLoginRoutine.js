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
exports.gproLoginRoutine = void 0;
const http_errors_1 = require("http-errors");
const db_1 = require("../../db");
const GProUser_1 = require("../../entities/GProUser");
const User_1 = require("../../entities/User");
const gpro_1 = require("../gpro");
const jwt_1 = require("./jwt");
function gproLoginRoutine(payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = payload;
        if (typeof login !== "string" || typeof password !== "string") {
            throw new http_errors_1.Unauthorized("Invalid or corrupted credentials");
        }
        let laravel_session;
        try {
            const loginResult = yield (0, gpro_1.gproLogin)({ login, password });
            laravel_session = loginResult.laravelSession;
        }
        catch (e) {
            throw new http_errors_1.Unauthorized((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : String(e));
        }
        // Init repos
        const ds = yield db_1.dsPromise;
        const gpUserRepo = ds.getRepository(GProUser_1.GProUser);
        const userRepo = ds.getRepository(User_1.User);
        let user;
        // Find GProUSer
        let gproUser = yield gpUserRepo.findOneBy({ login });
        if (gproUser == null) {
            // It's the first login
            const gproUserInfo = yield (0, gpro_1.getUserInfo)(laravel_session);
            if (gproUserInfo == null) {
                throw new http_errors_1.Unauthorized("Could not retrieve G.Pro user info");
            }
            const { firstName, lastName, photo, email, phone } = gproUserInfo;
            // Create generic user first
            user = new User_1.User();
            user.email = email;
            user.login = login;
            user.first_name = firstName;
            user.last_name = lastName;
            user.phone = phone;
            user.photo = photo;
            yield userRepo.save(user);
            // Now create G.Pro user record
            gproUser = new GProUser_1.GProUser();
            gproUser.user = user;
            gproUser.email = email;
            gproUser.login = login;
            gproUser.first_name = firstName;
            gproUser.last_name = lastName;
            gproUser.phone = phone;
            gproUser.photo = photo;
            gproUser.laravel_session = laravel_session;
            yield gpUserRepo.save(gproUser);
        }
        else {
            user = gproUser.user;
        }
        console.log({ user });
        return { token: (0, jwt_1.createJwt)(user) };
    });
}
exports.gproLoginRoutine = gproLoginRoutine;
