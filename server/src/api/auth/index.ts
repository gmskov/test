import {RequestHandler, Request, Router} from "express";
import {Unauthorized} from "http-errors";
import * as authHeaderHelper from "auth-header";

import {asyncHandler} from "../asyncHandler";
import {JwtUserPayload, verifyJwt} from "./jwt";
import {gproLoginRoutine} from "./gproLoginRoutine";
import {passwordLoginRoutine} from "./passwordLoginRoutine";
import {LoginResponse} from "./types";

export const authRouter = Router();

authRouter.post("/login/:method", asyncHandler(async (req, res) => {
    const payload = req.body;
    const {method} = req.params;

    let result: LoginResponse;
    switch (method) {
        case "gpro":
            result = await gproLoginRoutine(payload);
            break;
        case "password":
            result = await passwordLoginRoutine(payload);
            break;
        default:
            throw new Unauthorized(`Unsupported login method`);
    }

    res.cookie("token", result.token, {maxAge: 60 * 60 * 24 * 1000});
    res.json(result);
}));

export type AuthenticatedRequest = Request & {
    auth: JwtUserPayload;
}

export const authMiddleware: RequestHandler = asyncHandler(async (req, res, next) => {
    // Try cookies first
    let token = req.cookies.token;

    if (token == null) {
        const authorization = req.header("Authorization");
        if (authorization == null) {
            throw new Unauthorized("No authorization information found in the request");
        }
        const auth = authHeaderHelper.parse(authorization);
        token = auth.token;
        if (auth.scheme !== "Bearer") {
            throw new Unauthorized(`Unsupported authorization scheme ${auth.scheme}`);
        }
        if (typeof token !== "string") {
            throw new Unauthorized("Invalid authorization token");
        }
    }

    const jwtPayload = verifyJwt(token);
    if (jwtPayload == null) {
        throw new Unauthorized("Invalid or expired authorization token");
    }

    (req as AuthenticatedRequest).auth = jwtPayload;
    next();
});
