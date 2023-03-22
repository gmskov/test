import {Unauthorized} from "http-errors";

import {validatePassword} from "./password";
import {createJwt} from "./jwt";
import {LoginResponse} from "./types";

export async function passwordLoginRoutine(loginPayload: Record<string, unknown>): Promise<LoginResponse> {
    const {login, password} = loginPayload;
    if (typeof login !== "string" || typeof password !== "string") {
        throw new Unauthorized("Invalid or corrupted credentials");
    }

    const user = await validatePassword(login, password);
    if (user == null) {
        throw new Unauthorized("Invalid login or password");
    }

    return {token: createJwt(user), role: user.role};
}
