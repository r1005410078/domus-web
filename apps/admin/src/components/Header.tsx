"use client";

import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Navigation, { NavigationProps } from "./Navigation";
import { usePathname, useRouter } from "next/navigation";
import Add from "@mui/icons-material/Add";
import { UserAvatar, UserInfomation } from "./UserAvatar";
import Link from "next/link";
import { useEditUserProfileModal } from "./EditUserProfile";
import { isMobile } from "@/utils";
import { useCommandModal } from "@/hooks/useCommandModal";

export interface HeaderProps {
  tabBar: NavigationProps;
  onAdd?: () => void;
}

export default function Header({ tabBar, onAdd }: HeaderProps) {
  const router = useRouter();

  const { mode, setMode } = useColorScheme();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { commandDialog, setOpenCmdk } = useCommandModal({
    onSelect(command) {
      if (command.action === "link") {
        router.push(command.command);
        return;
      }

      switch (command.command) {
        case "AddHouse":
          onAdd?.();
          break;
      }
    },
  });

  const { editUserProfileModal, openEditUserProfileModal } =
    useEditUserProfileModal({
      layout: isMobile ? "fullscreen" : "center",
    });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCmdk((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
      {editUserProfileModal}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <IconButton
          size="md"
          variant="outlined"
          color="neutral"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            borderRadius: "50%",
          }}
        >
          <LanguageRoundedIcon />
        </IconButton>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          aria-pressed={pathname.indexOf("/house") === 0}
          href="/house"
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          房源
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/user"
          aria-pressed={pathname.indexOf("/user") === 0}
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          用户
        </Button>
        <IconButton variant="solid" color="primary" size="sm" onClick={onAdd}>
          <Add />
        </IconButton>
      </Stack>

      <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
        <IconButton
          variant="plain"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <IconButton variant="soft" color="primary" size="sm" onClick={onAdd}>
          <Add />
        </IconButton>
        <Drawer
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle>MEIDA</DialogTitle>
          <Box sx={{ px: 1 }}>
            <Navigation {...tabBar} />
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Box onClick={() => setOpenCmdk(true)}>
          <Input
            size="sm"
            variant="outlined"
            placeholder="请输入..."
            disabled
            startDecorator={<SearchRoundedIcon color="primary" />}
            endDecorator={
              <IconButton
                variant="outlined"
                color="neutral"
                sx={{ bgcolor: "background.level1" }}
              >
                <Typography level="title-sm" textColor="text.icon">
                  ⌘ K
                </Typography>
              </IconButton>
            }
            sx={{
              alignSelf: "center",
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
          />
        </Box>

        {commandDialog}
        {/* <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpenCmdk(true)}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            alignSelf: "center",
          }}
        >
          <SearchRoundedIcon />
        </IconButton> */}
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              borderRadius: "9999999px",
            }}
          >
            <UserAvatar />
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <MenuItem>
              <UserInfomation />
            </MenuItem>
            <ListDivider />
            <MenuItem
              onClick={() => {
                if (mode === "light") {
                  setMode("dark");
                } else {
                  setMode("light");
                }
              }}
            >
              {mode === "light" ? (
                <DarkModeRoundedIcon />
              ) : (
                <LightModeRoundedIcon />
              )}
              切换主题
            </MenuItem>
            <MenuItem onClick={() => openEditUserProfileModal()}>
              <SettingsRoundedIcon />
              用户设置
            </MenuItem>
            <ListDivider />
            <MenuItem
              onClick={() => {
                globalThis.localStorage.removeItem("token");
              }}
            >
              <Link href="/login">
                <>
                  <LogoutRoundedIcon />
                  退出
                </>
              </Link>
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
