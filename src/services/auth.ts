"use client";

import { UserInfomation } from "@/models/user";
import apiClient, { ResponseBody } from "./http";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfomation;
}

export const login = (data: LoginRequest) => {
  return apiClient.post<ResponseBody<LoginResponse>>(
    "/api/user_system/login",
    data
  ); // 返回 token 等信息
};
