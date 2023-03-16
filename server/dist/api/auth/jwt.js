"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.createJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "adsl;fhad lfkhasjklfh 342jkl5;uqregap8ovfl;jakf134raiuwegfkhdashf giuakfs";
const createJwt = ({ id, login, first_name, last_name, photo }) => {
    const payload = {
        firstName: first_name,
        lastName: last_name,
        id,
        login,
        photo,
    };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1h" });
};
exports.createJwt = createJwt;
const verifyJwt = (token) => {
    try {
        const result = jsonwebtoken_1.default.verify(token, secret, { complete: false });
        if (typeof result === "string") {
            return null;
        }
        else {
            return result;
        }
    }
    catch (e) {
        return null;
    }
};
exports.verifyJwt = verifyJwt;
