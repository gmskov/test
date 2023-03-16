import axios from "axios";
import {parse} from "node-html-parser";
import formUrlEncoded from "form-urlencoded";
import setCookie from "set-cookie-parser";

export type GProUserInfo = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string;
}
export const getUserInfo = async (laravelSession?: string): Promise<GProUserInfo | null> => {
    if (laravelSession == null) {
        throw new Error("laravel_session values is required");
    }

    const {data} = await axios.get(
        "https://pro.gbar.ee/dashboard/user",
        {
            validateStatus: (status) => status >= 200 && status <= 302,
            headers: {
                Cookie: `laravel_session=${laravelSession}`
            }
        }
    );

    const doc = parse(data);
    const title = doc.querySelector("head > title")?.innerText;
    if (title != null && /Dashboard -/.test(title)) {
        const userTableCells = doc.querySelectorAll("table.table-user-data td.user-properties + td");
        const photo = doc.querySelector(".user-sign-in-container img")?.getAttribute("src");
        return {
            lastName: userTableCells[0]!.innerText,
            firstName: userTableCells[1]!.innerText,
            email: userTableCells[2]!.innerText,
            phone: userTableCells[3]!.innerText,
            photo: `https://pro.gbar.ee${photo}`,
        }
    }
    else {
        return null;
    }
}

export type LoginPayload = {
    login: string;
    password: string;
}
export const gproLogin = async (payload: LoginPayload) => {
    const formData = formUrlEncoded(payload);
    const {headers} = await axios.post(
        "https://pro.gbar.ee/auth",
        formData,
        {
            validateStatus: (s) => s >= 200 && s <= 302,
            maxRedirects: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    const {location, "set-cookie": SetCookieHeader} = headers;
    const cookies = setCookie.parse(SetCookieHeader!, {map: true});
    if (location === "https://pro.gbar.ee/select-gbar") {
        return {laravelSession: cookies.laravel_session!.value}
    }
    else {
        throw new Error("Invalid credentials");
    }
}
