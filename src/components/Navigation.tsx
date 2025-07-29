"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import {
  Alert,
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { SxProps } from "@mui/joy/styles/types";
import { usePathname, useRouter } from "next/navigation";
import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import { useEditFavorite } from "@/hooks/useEditFavorite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  delete_favorite_categories,
  list_favorite_categories,
} from "@/services/favorte";
import { useToast } from "@/lib/ToastProvider";
import { mdComfirm } from "./Confirm";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import ModeTwoToneIcon from "@mui/icons-material/ModeTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
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
  const { eidtFavorite, openFavorite } = useEditFavorite();
  const client = useQueryClient();
  const toast = useToast();
  const { mutate: deleteFavorite } = useMutation({
    mutationFn: (id: number) => {
      return delete_favorite_categories(id);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "删除成功", severity: "success" });
      client.refetchQueries({ queryKey: ["list_favorite_categories"] });
    },
  });

  const { data } = useQuery({
    queryKey: ["list_favorite_categories"],
    queryFn: () => {
      return list_favorite_categories();
    },
  });

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      {eidtFavorite}
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

      {data != undefined && (
        <ListItem nested sx={{ mt: 2 }}>
          <ListSubheader
            sx={{
              letterSpacing: "2px",
              fontWeight: "800",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>标签</span>
            <IconButton
              variant="plain"
              size="sm"
              onClick={() => openFavorite({})}
            >
              <AddTwoToneIcon />
            </IconButton>
          </ListSubheader>
          <List
            aria-labelledby="nav-list-tags"
            size="sm"
            sx={{ "--ListItemDecorator-size": "32px" }}
          >
            {data.length === 0 && (
              <ListItem>
                <Typography
                  level="body-sm"
                  sx={{
                    fontFamily: "monospace",
                    opacity: "80%",
                    fontSize: "12px",
                  }}
                >
                  <InfoTwoToneIcon /> 在房源详情中点击小 ♥️ 收藏, 点击上面的 ➕
                  给收藏的房源打上标签 🏷️
                </Typography>
              </ListItem>
            )}
            {data.map((tag) => {
              const selected = value === tag.id.toString();

              return (
                <ListItem key={tag.id}>
                  <ListItemButton
                    selected={selected}
                    onClick={() => onChange?.(tag.id)}
                  >
                    <ListItemDecorator>
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "99px",
                          bgcolor: tag.color,
                        }}
                      ></Box>
                    </ListItemDecorator>
                    <ListItemContent>{tag.name}</ListItemContent>

                    {selected && (
                      <Dropdown>
                        <MenuButton
                          slots={{ root: IconButton }}
                          slotProps={{
                            root: {
                              variant: "plain",
                              size: "sm",
                              color: "neutral",
                            },
                          }}
                          sx={{
                            "--IconButton-size": "25px",
                          }}
                        >
                          <MoreVert />
                        </MenuButton>
                        <Menu
                          placement="auto"
                          sx={{
                            minWidth: 120,
                            "--ListItemDecorator-size": "24px",
                          }}
                        >
                          <MenuItem
                            onClick={() =>
                              openFavorite({
                                id: tag.id,
                                name: tag.name,
                                color: tag.color,
                              })
                            }
                          >
                            <ListItemDecorator>
                              <ModeTwoToneIcon />
                            </ListItemDecorator>{" "}
                            编辑
                          </MenuItem>
                          <MenuItem
                            variant="soft"
                            color="danger"
                            onClick={() => {
                              mdComfirm({
                                title: "删除收藏",
                                content: "确定删除收藏吗?, 删除后无法恢复!",
                                onOK: (state) => {
                                  deleteFavorite(tag.id);
                                  state.close();
                                },
                                onCancel: (state) => {
                                  state.close();
                                },
                              });
                            }}
                          >
                            <ListItemDecorator sx={{ color: "inherit" }}>
                              <DeleteForeverTwoToneIcon />
                            </ListItemDecorator>{" "}
                            删除
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </ListItem>
      )}
    </List>
  );
}
