"use client";

import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Navigation, {
  NavigationItem,
  NavigationProps,
} from "@/components/Navigation";
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
import House from "./House";

interface LayoutFrameProps {
  children: React.ReactNode;
  tabBar: NavigationProps;
  rootProps?: BoxProps;
}

export default function LayoutFrame({
  children,
  tabBar,
  rootProps,
}: LayoutFrameProps) {
  const [drawerAddOpen, setDrawerAddOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const pathname = usePathname();

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

      <Stack
        id="tab-bar"
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "space-around",
          display: { xs: "flex", sm: "none" },
          zIndex: "999",
          bottom: 0,
          position: "fixed",
          width: "100dvw",
          py: 2,
          backgroundColor: "background.body",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="plain"
          color="neutral"
          aria-pressed={pathname.indexOf("/house") === 0}
          component="a"
          href="/house"
          size="sm"
          startDecorator={<RoomPreferencesTwoToneIcon />}
          sx={{ flexDirection: "column", "--Button-gap": 0 }}
        >
          房源管理
        </Button>
        <Button
          variant="plain"
          color="neutral"
          aria-pressed={pathname.indexOf("/user") === 0}
          component="a"
          href="/user"
          size="md"
          startDecorator={<PersonAddTwoToneIcon />}
          sx={{ flexDirection: "column", "--Button-gap": 0 }}
        >
          用户管理
        </Button>
      </Stack>
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
          <Header tabBar={{ ...tabBar }} onAdd={() => setDrawerAddOpen(true)} />
        </Layout.Header>
        <Layout.SideNav>
          <Navigation {...tabBar} />
        </Layout.SideNav>
        {children}
      </Layout.Root>
      <Drawer
        anchor="bottom"
        sx={{}}
        slotProps={{
          content: {
            sx: {
              height: "100vh",
              width: { xs: "100%", md: "430px" },
              top: 0,
              left: { xs: 0, md: "calc(50% - 215px)" },
              borderRadius: 0,
              boxShadow: "lg",
              p: 0,
              backgroundColor: "background.body",
              overflow: "auto",
            },
          },
        }}
        open={drawerAddOpen}
        onClose={() => setDrawerAddOpen(false)}
      >
        <ModalClose />
        <DialogTitle>添加房源</DialogTitle>
        <Box sx={{ height: "100%", width: { xs: "100%", md: "430px" } }}>
          <House.Form onSubmit={() => setDrawerAddOpen(false)} />
        </Box>
      </Drawer>
    </CssVarsProvider>
  );
}
