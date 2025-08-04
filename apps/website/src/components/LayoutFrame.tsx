"use client";

import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Navigation, { NavigationProps } from "@/components/Navigation";
import {
  Box,
  BoxProps,
  Button,
  CssBaseline,
  CssVarsProvider,
  DialogTitle,
  Drawer,
  GlobalStyles,
  ModalClose,
  Stack,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import React from "react";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";

export interface LayoutFrameProps {
  children: React.ReactNode;
  tabBar: NavigationProps;
  rootProps?: BoxProps;
}

export default function LayoutFrame({
  children,
  tabBar,
  rootProps,
}: LayoutFrameProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          "*": {
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: `${theme.vars.palette.neutral.outlinedBorder} transparent`,
          },
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: theme.vars.palette.neutral.outlinedBorder, // 和系统灰接近
            borderRadius: theme.vars.radius.sm,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "*:hover::-webkit-scrollbar-thumb": {
            backgroundColor: theme.vars.palette.neutral.plainHoverBg, // hover 提升对比度
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        })}
      />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation {...tabBar} />
        </Layout.SideDrawer>
      )}

      <Layout.Root
        {...rootProps}
        sx={[
          drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          },
          ...(Array.isArray(rootProps?.sx) ? rootProps.sx : [rootProps?.sx]),
        ]}
      >
        <Layout.Header>
          <Header />
        </Layout.Header>
        {children}
      </Layout.Root>
    </CssVarsProvider>
  );
}
