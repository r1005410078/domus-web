import * as React from "react";
import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import QueryProvider from "@/lib/QueryProvider";
import { ToastProvider } from "@/lib/ToastProvider";
import Confirm from "@/components/Confirm";
import "./globals.css";

export const metadata = {
  title: "美大",
  description: "美大管理系统",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <QueryProvider>
            <ThemeRegistry>{props.children}</ThemeRegistry>
            <Confirm />
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

// 登陆
