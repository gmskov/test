import * as crypto from "crypto";

import {dsPromise} from "../../db";
import {User} from "../../entities/User";
import {Password} from "../../entities/Password";

const HASH_ALGO = "SHA256";

export function getPasswordHash(password: string, salt: string): string {
    return crypto
        .createHash(HASH_ALGO)
        .update(password + salt, "utf-8")
        .digest("base64");
}

export function generatePasswordHash(password: string) {
    const salt = crypto.randomBytes(32).toString("base64");
    const hash = getPasswordHash(password, salt);
    return {salt, hash};
}

export async function validatePassword(login: string, password: string): Promise<User | null> {
    const ds = await dsPromise;
    const user = await ds.getRepository(User).findOneBy({login});
    if (user == null) {
        console.log("User not found");
        return null;
    }
    const pwd = await ds.getRepository(Password).findOneBy({user_id: user.id});
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
}
