"use client";

import React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import Layout from "@/components/Layout";
import UserList from "@/components/UserList";
import RoleList from "@/components/RoleList";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import dynamic from "next/dynamic";

const DynamicRoleTable = dynamic(() => import("@/components/RoleTable"), {
  loading: () => <p>加载中...</p>,
});

const DynamicUserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <p>加载中...</p>,
});

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
          pt: { xs: 0, md: 2 },
          position: "relative",
          display: {
            xs: "initial",
            md: "initial",
          },
        }}
      >
        {(() => {
          switch (tabBar) {
            case "user":
              return (
                <>
                  <DynamicUserTable />
                  <UserList />
                </>
              );
            case "role":
              return (
                <>
                  <DynamicRoleTable />
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
