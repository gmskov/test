import {axiosInstance} from "@pankod/refine-simple-rest";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

axiosInstance.defaults.baseURL = API_BASE_URL;

export type LoginPayload = {
    method: "gpro" | "password";
    login: string;
    password: string;
}

export const login = async({method, ...payload}: LoginPayload): Promise<string> => {
    const {data: {token}} = await axiosInstance.post(`/login/${method}`, payload, {
        withCredentials: true,
    });
    if (token == null) {
        throw new Error("No token received");
    }
    return token;
}

export const fileUrl = (id: string) => {
    return `${API_BASE_URL}/file/${id}/attachment`;
}
