"use client";

import { Permission, Role, User, UserInfomation } from "@/models/user";
import apiClient, { ResponseBody } from "./http";

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

export interface RoleRequest {
  id?: string;
  name: string;
  description: string;
  permissions: { source: string; action: string }[];
}

export function createRole(data: Partial<RoleRequest>) {
  return apiClient.post<ResponseBody<Permission[]>>(
    "/api/user_system/role/create",
    data
  );
}

export function updateRole(data: Partial<RoleRequest>) {
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

export interface UserRequest {
  id?: string;
  username: string;
  email?: any;
  phone?: any;
  // 角色
  roles: string[];
  password?: string;
}

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
