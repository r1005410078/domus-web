"use client";

import React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Layout from "@/components/Layout";
import UserList from "@/components/UserList";
import RoleList from "@/components/RoleList";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const DynamicRoleTable = dynamic(() => import("@/components/RoleTable"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

const DynamicUserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

export default function Page() {
  const router = useRouter();
  const { nav } = useParams<{ nav: string }>();

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
        value: nav,
        items: [
          {
            label: "用户",
            key: "profiles",
            icon: <ManageAccountsTwoToneIcon />,
          },
          {
            label: "角色",
            key: "role",
            icon: <RoomPreferencesTwoToneIcon />,
          },
        ],
        onChange: (tabBar) => {
          router.push(`/user/${tabBar}`);
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
          switch (nav) {
            case "profiles":
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
