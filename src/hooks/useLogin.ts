"use client";

import { useToast } from "@/libs/ToastProvider";
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import Router from "next/router";

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
      Router.replace("/");
    },
    onError: (err) => {},
  });
}
