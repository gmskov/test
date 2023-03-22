import {AuthProvider} from "@pankod/refine-core";
import decode from "jwt-decode";
import axios from "axios";
import {axiosInstance} from "@pankod/refine-simple-rest";

import {login, LoginPayload} from "./api";

export const TOKEN_KEY = "token";
export const ROLE_KEY = "role";

export const authProvider: AuthProvider = {
    login: async (payload: LoginPayload) => {
        let token = localStorage.getItem(TOKEN_KEY);
        const role = localStorage.getItem(ROLE_KEY);
        if (token == null || role == null) {
            const authResp = await login(payload);
            token = authResp.token
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(ROLE_KEY, authResp.role);
        }
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        return Promise.resolve();
    },
    checkError: (error) => {
        console.log({error});
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                const {location} = window;
                const currentPath = location.pathname + location.search;
                const redirectTo = `/login?to=${encodeURIComponent(currentPath)}`;
                return Promise.reject(redirectTo);
            }
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return Promise.resolve();
        }

        return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return Promise.reject();
        }
        else {
            const {firstName, lastName, photo} = decode<any>(token);
            return {
                name: `${firstName} ${lastName}`,
                avatar: photo
            };
        }
    },
};
