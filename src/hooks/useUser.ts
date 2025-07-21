"use client";

import { useToast } from "@/libs/ToastProvider";
import { Role, User } from "@/models/user";
import {
  createRole,
  createUser,
  deleteRole,
  deleteUser,
  getPermissionsDetailsList,
  getRoleList,
  getUserList,
  RoleRequest,
  updateRole,
  updateUser,
  updateUserProfile,
  UserRequest,
} from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Update } from "next/dist/build/swc/types";

export function useRoleList() {
  return useQuery({
    queryKey: ["useRoleList"],
    queryFn: async () => {
      const res = await getRoleList();
      return res.data.data.list;
    },
  });
}

export function useRoleMap() {
  const { data: roles } = useRoleList();
  const rolesMap = roles?.reduce((pre, cur) => {
    pre.set(cur.id, cur);
    return pre;
  }, new Map<string, Role>());

  return rolesMap;
}

export function useUserList() {
  return useQuery({
    queryKey: ["useUserList"],
    queryFn: async () => {
      const res = await getUserList();
      return res.data.data.list;
    },
  });
}

export function usePermissionsDetailsList() {
  return useQuery({
    queryKey: ["usePermissionsDetailsList"],
    queryFn: async () => {
      const res = await getPermissionsDetailsList();
      return res.data.data;
    },
  });
}

export function useSaveRole() {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleRequest) => {
      if (data.id) {
        return updateRole(data);
      }
      return createRole(data);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "创建成功", severity: "success" });
      client.invalidateQueries({ queryKey: ["useRoleList"] });
    },
    onError: (err) => {
      toast.showToast({ message: `创建失败: ${err}`, severity: "danger" });
    },
  });
}

export function useSaveUser() {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserRequest>) => {
      if (data.id) {
        return updateUser(data);
      }
      return createUser(data);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "保存成功", severity: "success" });
      client.invalidateQueries({ queryKey: ["useUserList"] });
    },
    onError: (err) => {
      toast.showToast({ message: `创建失败: ${err}`, severity: "danger" });
    },
  });
}

export function useUpdateUserProfile() {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "保存成功", severity: "success" });
      globalThis.localStorage.removeItem("token");
      globalThis.location.replace("/login");
    },
    onError: (err) => {
      toast.showToast({ message: `保存失败: ${err}`, severity: "danger" });
    },
  });
}

export function useDeleteRole() {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return deleteRole(id);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "删除成功", severity: "success" });
      client.invalidateQueries({ queryKey: ["useRoleList"] });
    },
    onError: (err) => {
      toast.showToast({ message: `删除失败: ${err}`, severity: "danger" });
    },
  });
}

export function useDeleteUser() {
  const toast = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return deleteUser(id);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "删除成功", severity: "success" });
      client.invalidateQueries({ queryKey: ["useUserList"] });
    },
    onError: (err) => {
      toast.showToast({ message: `删除失败: ${err}`, severity: "danger" });
    },
  });
}
