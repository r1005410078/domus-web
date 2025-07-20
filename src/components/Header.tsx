"use client";
import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
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
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Navigation, { NavigationProps } from "./Navigation";
import { usePathname } from "next/navigation";
import Add from "@mui/icons-material/Add";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        data-screenshot="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: "center" }}
        onClick={() => {
          if (mode === "light") {
            setMode("dark");
          } else {
            setMode("light");
          }
        }}
      >
        {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

interface HeaderProps {
  tabBar: NavigationProps;
  onAdd?: () => void;
}

export default function Header({ tabBar, onAdd }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [openCmdk, setOpenCmdk] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      console.log("keydown", e.metaKey);
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCmdk((open) => !open);
      }
    };
    console.log(111);
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
          href="/"
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
        <Input
          size="sm"
          variant="outlined"
          placeholder="搜索功能..."
          startDecorator={<SearchRoundedIcon color="primary" />}
          onClick={() => setOpenCmdk(true)}
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

        <CommandDialog open={openCmdk} onOpenChange={setOpenCmdk}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
        <ColorSchemeToggle />
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
            <Avatar
              src="https://i.pravatar.cc/40?img=2"
              srcSet="https://i.pravatar.cc/80?img=2"
              sx={{ maxWidth: "32px", maxHeight: "32px" }}
            />
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src="https://i.pravatar.cc/40?img=2"
                  srcSet="https://i.pravatar.cc/80?img=2"
                  sx={{ borderRadius: "50%" }}
                />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    Rick Sanchez
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    rick@email.com
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem>
              <HelpRoundedIcon />
              Help
            </MenuItem>
            <MenuItem>
              <SettingsRoundedIcon />
              Settings
            </MenuItem>
            <ListDivider />
            <MenuItem component="a" href="/blog/first-look-at-joy/">
              First look at Joy UI
              <OpenInNewRoundedIcon />
            </MenuItem>
            <MenuItem
              component="a"
              href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
            >
              Sourcecode
              <OpenInNewRoundedIcon />
            </MenuItem>
            <ListDivider />
            <MenuItem>
              <LogoutRoundedIcon />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
