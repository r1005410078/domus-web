import * as React from "react";
import ThemeRegistry from "@repo/components/theme-registry/ThemeRegistry";
import QueryProvider from "@repo/lib/QueryProvider";
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
        <QueryProvider>
          <ThemeRegistry>{props.children}</ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
