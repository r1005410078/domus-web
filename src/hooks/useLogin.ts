"use client";

import { useToast } from "@/libs/ToastProvider";
import { UserInfomation } from "@/models/user";
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";

export function useLogin() {
  const toast = useToast();
  const { setUserProfile } = useUserProfile();

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

      setUserProfile(res.data.data.user);
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
  userProfile: UserInfomation | null;
  setUserProfile: (useUserProfile: UserInfomation) => void;
  avatarName: string;
  avatarURL?: string;
}

export const useUserProfile = create<UserStore>((set) => ({
  avatarName: "R",
  userProfile: getUserInformation(),
  setUserProfile: (userProfile) => {
    // 缓存用户信息
    globalThis.localStorage.setItem(
      "USER_INFORMATION",
      JSON.stringify(userProfile)
    );
    // 更新状态
    set({
      userProfile,
      avatarName: userProfile?.username?.[0]?.toUpperCase() || "R",
      // avatarURL: userInfo?.avatarURL || "https://i.pravatar.cc/80?img=2",
    });
  },
}));
