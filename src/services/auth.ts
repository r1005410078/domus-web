"use client";

import apiClient, { ResponseBody } from "./http";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = (data: LoginRequest) => {
  return apiClient.post<ResponseBody<LoginResponse>>("/api/login", data); // 返回 token 等信息
};
