"use client";

import axios from "axios";

const http = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器（添加 token）
http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（统一处理 403）
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // 清除 token（可选）
      localStorage.removeItem("token");
      // 跳转到登录页面
      location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export interface ResponseBody<T> {
  code: number;
  data: T;
  msg: string;
}

export default http;
