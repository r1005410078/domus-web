"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import { IconButton } from "@mui/joy";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { SxProps } from "@mui/joy/styles/types";
import { usePathname, useRouter } from "next/navigation";

export interface NavigationProps {
  value: string;
  onChange: (value: any) => void;
  items: NavigationItem[];
  tags?: TagItem[];
}

export interface TagItem {
  label: string;
  key: string;
  color: string;
}

export interface NavigationItem {
  label: string;
  key: string;
  icon: React.ReactNode;
  sx?: SxProps;
}

export default function Navigation({
  value,
  onChange,
  items,
  tags,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname", pathname);

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem nested>
        <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
          菜单
        </ListSubheader>
        <List aria-labelledby="nav-list-browse">
          {items.map((item) => (
            <ListItem key={item.key} sx={item.sx}>
              <ListItemButton
                selected={value === item.key}
                onClick={() => {
                  onChange(item.key);
                  router.push(`${pathname}?nav=${item.key}`);
                }}
              >
                <ListItemDecorator>{item.icon}</ListItemDecorator>
                <ListItemContent>{item.label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>

      {tags != undefined && (
        <ListItem nested sx={{ mt: 2 }}>
          <ListSubheader
            sx={{
              letterSpacing: "2px",
              fontWeight: "800",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>收藏</span>
            <IconButton variant="plain" size="sm">
              <AddTwoToneIcon />
            </IconButton>
          </ListSubheader>
          <List
            aria-labelledby="nav-list-tags"
            size="sm"
            sx={{ "--ListItemDecorator-size": "32px" }}
          >
            {tags.map((tag) => (
              <ListItem key={tag.label}>
                <ListItemButton
                  selected={value === tag.key}
                  onClick={() => onChange(tag.key)}
                >
                  <ListItemDecorator>
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "99px",
                        bgcolor: tag.color,
                      }}
                    />
                  </ListItemDecorator>
                  <ListItemContent>{tag.label}</ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </ListItem>
      )}
    </List>
  );
}
