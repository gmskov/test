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
exports.gproLogin = exports.getUserInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = require("node-html-parser");
const form_urlencoded_1 = __importDefault(require("form-urlencoded"));
const set_cookie_parser_1 = __importDefault(require("set-cookie-parser"));
const getUserInfo = (laravelSession) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (laravelSession == null) {
        throw new Error("laravel_session values is required");
    }
    const { data } = yield axios_1.default.get("https://pro.gbar.ee/dashboard/user", {
        validateStatus: (status) => status >= 200 && status <= 302,
        headers: {
            Cookie: `laravel_session=${laravelSession}`
        }
    });
    const doc = (0, node_html_parser_1.parse)(data);
    const title = (_a = doc.querySelector("head > title")) === null || _a === void 0 ? void 0 : _a.innerText;
    if (title != null && /Dashboard -/.test(title)) {
        const userTableCells = doc.querySelectorAll("table.table-user-data td.user-properties + td");
        const photo = (_b = doc.querySelector(".user-sign-in-container img")) === null || _b === void 0 ? void 0 : _b.getAttribute("src");
        return {
            lastName: userTableCells[0].innerText,
            firstName: userTableCells[1].innerText,
            email: userTableCells[2].innerText,
            phone: userTableCells[3].innerText,
            photo: `https://pro.gbar.ee${photo}`,
        };
    }
    else {
        return null;
    }
});
exports.getUserInfo = getUserInfo;
const gproLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = (0, form_urlencoded_1.default)(payload);
    const { headers } = yield axios_1.default.post("https://pro.gbar.ee/auth", formData, {
        validateStatus: (s) => s >= 200 && s <= 302,
        maxRedirects: 0,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const { location, "set-cookie": SetCookieHeader } = headers;
    const cookies = set_cookie_parser_1.default.parse(SetCookieHeader, { map: true });
    if (location === "https://pro.gbar.ee/select-gbar") {
        return { laravelSession: cookies.laravel_session.value };
    }
    else {
        throw new Error("Invalid credentials");
    }
});
exports.gproLogin = gproLogin;
