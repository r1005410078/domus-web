"use client";

import React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import UserTable from "@/components/UserTable";
import Layout from "@/components/Layout";
import UserList from "@/components/UserList";
import RoleList from "@/components/RoleList";
import RoleTable from "@/components/RoleTable";
import { Box, Button, Typography } from "@mui/joy";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";

export default function Page() {
  const [tabBar, setTabBar] = React.useState("user");
  return (
    <LayoutFrame
      rootProps={{
        sx: {
          gridTemplateColumns: {
            xs: "1fr",
            md: "160px 1fr",
          },
        },
      }}
      tabBar={{
        value: tabBar,
        items: [
          {
            label: "用户",
            key: "user",
            icon: <ManageAccountsTwoToneIcon />,
          },
          {
            label: "角色",
            key: "role",
            icon: <RoomPreferencesTwoToneIcon />,
          },
        ],
        onChange: (tabBar) => {
          setTabBar(tabBar);
        },
      }}
    >
      <Layout.Main
        sx={{
          p: 2,
          position: "relative",
          display: {
            xs: "initial",
            md: "initial",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography
            level="h2"
            component="h1"
            sx={{ display: { xs: "none", sm: "initial" } }}
          >
            用户管理
          </Typography>
        </Box>
        {(() => {
          switch (tabBar) {
            case "user":
              return (
                <>
                  <UserTable />
                  <UserList />
                </>
              );
            case "role":
              return (
                <>
                  <RoleTable />
                  <RoleList />
                </>
              );
            default:
              return null;
          }
        })()}
      </Layout.Main>
    </LayoutFrame>
  );
}
