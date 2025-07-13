import * as React from "react";
import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import QueryProvider from "@/libs/QueryProvider";
import { ToastProvider } from "@/libs/ToastProvider";

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
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

// 登陆
