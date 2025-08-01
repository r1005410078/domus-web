/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
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
import { User } from "@/models/user";
import { useAddUserModal } from "@/hooks/useAddUserModal";
import { useDeleteUser, useUserList } from "@/hooks/useUser";
import { mdComfirm } from "./Confirm";
import { dateToString } from "@/models/house";
import { Input, Sheet, Stack } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterItems } from "@/hooks/useFilterItems";

function RowMenu({ user }: { user: User }) {
  const { openUserEditModal, editorModal } = useAddUserModal({
    layout: "fullscreen",
  });
  const { mutate } = useDeleteUser();

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
              openUserEditModal(user);
            }}
          >
            编辑
          </MenuItem>
          <Divider />
          <MenuItem
            color="danger"
            onClick={() => {
              mdComfirm({
                title: "删除用户",
                content: "确定删除用户吗?",
                onOK: (state) => {
                  mutate(user.user_id);
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

export default function UserList() {
  const { data: listItems } = useUserList();
  const { editorModal, openUserEditModal } = useAddUserModal({
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
            handleFilter(["username", "phone", "email", "roles"], value);
          }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => openUserEditModal({})}
        >
          <Add />
        </IconButton>
      </Sheet>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        {filterItems?.map((listItem) => (
          <List
            key={listItem.user_id}
            size="sm"
            sx={{ "--ListItem-paddingX": 0 }}
          >
            <ListItem
              endAction={<RowMenu user={listItem} />}
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
                  {" "}
                  <Avatar size="sm">
                    {listItem.username
                      .split(" ")?.[0]?.[0]
                      ?.toLocaleUpperCase()}
                  </Avatar>
                </ListItemDecorator>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 600 }}>
                    {listItem.username}
                  </Typography>
                  <Typography level="body-xs" gutterBottom>
                    {listItem.phone}
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
      {editorModal}
    </Stack>
  );
}
