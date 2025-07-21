"use client";

import { Permission, Role, User, UserInfomation } from "@/models/user";
import apiClient, { ResponseBody } from "./http";
import z from "zod";

export function getRoleList() {
  return apiClient.get<ResponseBody<{ list: Role[]; total: number }>>(
    "/api/user_system/role/list?page=1&page_size=100"
  );
}

export function getUserList() {
  return apiClient.get<ResponseBody<{ list: User[]; total: number }>>(
    "/api/user_system/user/list?page=1&page_size=100"
  );
}

export function getPermissionsDetailsList() {
  return apiClient.get<ResponseBody<Permission[]>>(
    "/api/user_system/role/permissions_details/list"
  );
} // 获取权限详情

export const roleRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.object({ source: z.string(), action: z.string() })),
});

export type RoleRequest = z.infer<typeof roleRequestSchema>;

export function createRole(data: RoleRequest) {
  return apiClient.post<ResponseBody<Permission[]>>(
    "/api/user_system/role/create",
    data
  );
}

export function updateRole(data: RoleRequest) {
  return apiClient.post<ResponseBody<Permission[]>>(
    "/api/user_system/role/update",
    data
  );
}

export function deleteRole(id: string) {
  return apiClient.post<ResponseBody<any>>(
    `/api/user_system/role/delete/${id}`
  );
}

export const userRequestSchema = z.object({
  id: z.string().optional(),
  username: z.string("用户名不能为空"),
  email: z.string().optional(),
  phone: z.string().optional(),
  roles: z.array(z.string()),
  password: z.string().optional(),
});

export type UserRequest = z.infer<typeof userRequestSchema>;

export function createUser(data: Partial<RoleRequest>) {
  return apiClient.post<ResponseBody<any>>(
    "/api/user_system/user/register",
    data
  );
}

export function updateUser(data: Partial<RoleRequest>) {
  return apiClient.post<ResponseBody<any>>(
    "/api/user_system/user/update",
    data
  );
}

export type UpdateUserInfoRequest = Partial<
  UserInfomation & { password: string }
>;

export function updateUserProfile(data: Partial<UpdateUserInfoRequest>) {
  return apiClient.post<ResponseBody<any>>(
    "/api/user_system/user_profile/update",
    data
  );
}

export function deleteUser(id: string) {
  return apiClient.post<ResponseBody<any>>(
    `/api/user_system/user/delete/${id}`
  );
}
