"use client";

import { Permission, Role } from "@/models/user";
import apiClient, { ResponseBody } from "./http";

export function getRoleList() {
  return apiClient.get<ResponseBody<{ list: Role[]; total: number }>>(
    "/api/user_system/role/list?page=1&page_size=100"
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
