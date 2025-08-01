"use client";

import * as React from "react";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import { SxProps } from "@mui/joy/styles/types";

export interface NavigationProps {
  value: any;
  onChange?: (value: any) => void;
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
}: NavigationProps) {
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
                  onChange?.(item.key);
                }}
              >
                <ListItemDecorator>{item.icon}</ListItemDecorator>
                <ListItemContent>{item.label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>
    </List>
  );
}
