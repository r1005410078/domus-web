"use client";

import { useToast } from "@/libs/ToastProvider";
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const toast = useToast();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "登录成功", severity: "success" });
      localStorage.setItem("token", res.data.data.token);
      location.replace("/");
      console.log("跳转到首页");
    },
    onError: (err) => {},
  });
}
