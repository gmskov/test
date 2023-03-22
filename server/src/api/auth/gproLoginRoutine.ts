import {Unauthorized} from "http-errors";

import {dsPromise} from "../../db";
import {GProUser} from "../../entities/GProUser";
import {User} from "../../entities/User";
import {getUserInfo, gproLogin} from "../gpro";
import {createJwt} from "./jwt";
import {LoginResponse} from "./types";


export async function gproLoginRoutine(payload: Record<string, unknown>): Promise<LoginResponse> {
    const {login, password} = payload;

    if (typeof login !== "string" || typeof password !== "string") {
        throw new Unauthorized("Invalid or corrupted credentials");
    }

    let laravel_session: string;
    try {
        const loginResult = await gproLogin({login, password});
        laravel_session = loginResult.laravelSession;
    }
    catch (e: any) {
        throw new Unauthorized(e?.message ?? String(e));
    }

    // Init repos
    const ds = await dsPromise;
    const gpUserRepo = ds.getRepository(GProUser);
    const userRepo = ds.getRepository(User);
    let user: User;

    // Find GProUSer
    let gproUser = await gpUserRepo.findOneBy({login});
    if (gproUser == null) {
        // It's the first login
        const gproUserInfo = await getUserInfo(laravel_session);
        if (gproUserInfo == null) {
            throw new Unauthorized("Could not retrieve G.Pro user info");
        }
        const {firstName, lastName, photo, email, phone} = gproUserInfo;

        // Create generic user first
        user = new User();
        user.email = email;
        user.login = login;
        user.first_name = firstName;
        user.last_name = lastName;
        user.phone = phone;
        user.photo = photo;
        await userRepo.save(user);

        // Now create G.Pro user record
        gproUser = new GProUser();
        gproUser.user = user;
        gproUser.email = email;
        gproUser.login = login;
        gproUser.first_name = firstName;
        gproUser.last_name = lastName;
        gproUser.phone = phone;
        gproUser.photo = photo;
        gproUser.laravel_session = laravel_session;
        await gpUserRepo.save(gproUser);
    }
    else {
        user = gproUser.user;
    }

    console.log({user});

    return {token: createJwt(user), role: user.role};
}
