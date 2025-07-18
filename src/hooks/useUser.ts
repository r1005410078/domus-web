"use client";

import { useToast } from "@/libs/ToastProvider";
import {
  createRole,
  getPermissionsDetailsList,
  getRoleList,
  RoleRequest,
  updateRole,
} from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoleList() {
  return useQuery({
    queryKey: ["useRoleList"],
    queryFn: async () => {
      const res = await getRoleList();
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
    mutationFn: (data: Partial<RoleRequest>) => {
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
