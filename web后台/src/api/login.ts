import { post } from "./http.js";

export const login = (params: any) => post("/base/login", params);
export const captcha = (params: any) => post("/base/captcha", params);
