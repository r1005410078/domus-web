/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useDeleteRole, useRoleList } from "@/hooks/useUser";
import { dateToString } from "@/models/house";
import { Role } from "@/models/user";
import { mdComfirm } from "./Confirm";
import { useAddRoleModal } from "@/hooks/useAddRoleModal";
import { Input, Sheet, Stack } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterItems } from "@/hooks/useFilterItems";

function RowMenu({ role }: { role: Role }) {
  const { openRoleEditModal, editorModal } = useAddRoleModal({
    layout: "fullscreen",
  });
  const { mutate } = useDeleteRole();

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem
            onClick={() => {
              openRoleEditModal(role);
            }}
          >
            编辑
          </MenuItem>
          <Divider />
          <MenuItem
            color="danger"
            onClick={() => {
              mdComfirm({
                title: "删除角色",
                content: "确定删除角色吗?",
                onOK: (state) => {
                  mutate(role.id);
                  state.close();
                },
                onCancel: (state) => {
                  state.close();
                },
              });
            }}
          >
            删除
          </MenuItem>
        </Menu>
      </Dropdown>
      {editorModal}
    </>
  );
}

export default function RoleList() {
  const { data: listItems } = useRoleList();
  const { editorModal, openRoleEditModal } = useAddRoleModal({
    layout: "fullscreen",
  });
  const { filterItems, handleFilter } = useFilterItems(listItems);

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Sheet sx={{ display: { xs: "flex", sm: "none" }, gap: 2 }}>
        <Input
          size="sm"
          placeholder="检索"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
          onChange={(e) => {
            const value = e.target.value.toLocaleLowerCase();
            handleFilter(["name", "description", "permissions"], value);
          }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => openRoleEditModal({})}
        >
          <Add />
        </IconButton>
        {editorModal}
      </Sheet>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        {filterItems?.map((listItem) => (
          <List key={listItem.id} size="sm" sx={{ "--ListItem-paddingX": 0 }}>
            <ListItem
              endAction={<RowMenu role={listItem} />}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <ListItemContent
                sx={{ display: "flex", gap: 2, alignItems: "start" }}
              >
                <ListItemDecorator>
                  <Avatar size="sm">
                    {listItem.name.split(" ")[0]?.[0]?.toLocaleUpperCase()}
                  </Avatar>
                </ListItemDecorator>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 600 }}>
                    {listItem.name}
                  </Typography>
                  <Typography level="body-xs" gutterBottom>
                    {listItem.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <Typography level="body-xs">
                      {dateToString(listItem.created_at)}
                    </Typography>
                  </Box>
                </div>
              </ListItemContent>
            </ListItem>
            <ListDivider />
          </List>
        ))}
      </Box>
    </Stack>
  );
}
