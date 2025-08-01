"use client";

import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Navigation, { NavigationProps } from "./Navigation";
import { usePathname, useRouter } from "next/navigation";
import Add from "@mui/icons-material/Add";

export interface HeaderProps {
  tabBar: NavigationProps;
  onAdd?: () => void;
}

export default function Header({ tabBar, onAdd }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
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
      </Box>
    </Box>
  );
}
