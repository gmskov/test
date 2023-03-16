import jsonwebtoken from "jsonwebtoken";
import {User} from "../../entities/User";

const secret = "adsl;fhad lfkhasjklfh 342jkl5;uqregap8ovfl;jakf134raiuwegfkhdashf giuakfs";

export type JwtUserPayload = {
    id: string;
    login: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
}
export const createJwt = ({id, login, first_name, last_name, photo}: User) => {
    const payload: JwtUserPayload = {
        firstName: first_name,
        lastName: last_name,
        id,
        login,
        photo,
    }
    return jsonwebtoken.sign(payload, secret, {expiresIn: "1h"});
};

export const verifyJwt = (token: string): JwtUserPayload | null => {
    try {
        const result = jsonwebtoken.verify(token, secret, {complete: false});
        if (typeof result === "string") {
            return null;
        }
        else {
            return result as JwtUserPayload;
        }
    }
    catch (e) {
        return null;
    }
}
