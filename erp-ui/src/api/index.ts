import {axiosInstance} from "@pankod/refine-simple-rest";
export const API_BASE_URL = "http://localhost:4567/api";

axiosInstance.defaults.baseURL = API_BASE_URL;

export type LoginPayload = {
    method: "gpro" | "password";
    login: string;
    password: string;
}

export type AuthResponse = {
    token: string;
    role: string;
}

export const login = async({method, ...payload}: LoginPayload): Promise<AuthResponse> => {
    const {data: {token,role}} = await axiosInstance.post(`/login/${method}`, payload, {
        withCredentials: true,
    });
    if (token == null) {
        throw new Error("No token received");
    }
    return {token, role};
}

export const fileUrl = (id: string) => {
    return `${API_BASE_URL}/file/${id}/attachment`;
}
