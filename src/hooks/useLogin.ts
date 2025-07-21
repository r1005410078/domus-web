"use client";

import { useToast } from "@/libs/ToastProvider";
import { UserInfomation } from "@/models/user";
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";

export function useLogin() {
  const toast = useToast();
  const { setUserInfo } = useUserInformation();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "登录成功", severity: "success" });

      console.log("token", res.data.data.token);
      localStorage.setItem("token", res.data.data.token);

      setUserInfo(res.data.data.user);
      location.replace("/");
      console.log("跳转到首页");
    },
    onError: (err) => {
      toast.showToast({ message: `登录失败: ${err}`, severity: "danger" });
    },
  });
}

export function getUserInformation(): UserInfomation | null {
  const userInfo = globalThis.localStorage.getItem("USER_INFORMATION");
  try {
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  } catch (error) {
    console.error(error, userInfo);
    globalThis.localStorage.removeItem("USER_INFORMATION");
  }

  return null;
}

interface UserStore {
  userInfo: UserInfomation | null;
  setUserInfo: (userInfo: UserInfomation | null) => void;
  avatarName: string;
  avatarURL?: string;
}

console.log("getUserInformation", getUserInformation());

export const useUserInformation = create<UserStore>((set) => ({
  avatarName: "R",
  userInfo: getUserInformation(),
  setUserInfo: (userInfo) => {
    // 缓存用户信息
    globalThis.localStorage.setItem(
      "USER_INFORMATION",
      JSON.stringify(userInfo)
    );
    // 更新状态
    set({
      userInfo,
      avatarName: userInfo?.username?.[0]?.toUpperCase() || "R",
      // avatarURL: userInfo?.avatarURL || "https://i.pravatar.cc/80?img=2",
    });
  },
}));
