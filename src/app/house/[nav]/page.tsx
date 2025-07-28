"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import Layout from "@/components/Layout";
import HouseList from "@/components/HouseList";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const DynamicHouseTable = dynamic(() => import("@/components/HouseTable"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

const DynamicCommunityTable = dynamic(
  () => import("@/components/CommunityTable"),
  {
    loading: () => <p>加载中...</p>,
    ssr: false,
  }
);

const tabBarItems = [
  {
    label: "出售",
    key: "sold",
    icon: <OutboxRoundedIcon />,
  },
  {
    label: "出租",
    key: "rent",
    icon: <DeckTwoToneIcon />,
  },
  {
    label: "房源",
    key: "house",
    icon: <TableViewTwoToneIcon />,
    sx: {
      display: {
        xs: "none",
        md: "initial",
      },
    },
  },
  {
    label: "小区",
    key: "community",
    icon: <MapsHomeWorkTwoToneIcon />,
    sx: {
      display: {
        xs: "none",
        md: "initial",
      },
    },
  },
];

const transactionType = {
  sold: "出售",
  rent: "出租",
  house: "房源",
  community: "小区",
};

const gridTemplateColumns = {
  sold: {
    xs: "1fr",
    md: "minmax(160px, 260px) minmax(260px, 430px) minmax(430px, 1fr)",
  },
  rent: {
    xs: "1fr",
    md: "minmax(160px, 260px) minmax(260px, 430px) minmax(430px, 1fr)",
  },
  house: {
    xs: "1fr",
    md: "160px 1fr",
  },
  community: {
    xs: "1fr",
    md: "160px 1fr",
  },
};

export default function Home() {
  const router = useRouter();
  const { nav } = useParams<{ nav: string }>();

  return (
    <>
      <LayoutFrame
        rootProps={{
          sx: {
            // @ts-ignore
            gridTemplateColumns: gridTemplateColumns[nav],
          },
        }}
        tabBar={{
          items: tabBarItems,
          value: nav,
          onChange(value) {
            router.push(`/house/${value}`);
          },
          tags: [
            {
              label: "带看的",
              key: "view",
              color: "primary.500",
            },
            {
              label: "待联系的",
              key: "contact",
              color: "danger.500",
            },
          ],
        }}
      >
        {(() => {
          switch (nav) {
            case "sold":
            case "rent":
              // @ts-ignore
              return <HouseList transactionType={transactionType[nav]} />;
            case "house":
              return (
                <Layout.Main sx={{ p: 2, position: "relative" }}>
                  <DynamicHouseTable />
                </Layout.Main>
              );
            case "community":
              return (
                <Layout.Main sx={{ p: 2, position: "relative" }}>
                  <DynamicCommunityTable />
                </Layout.Main>
              );
            default:
              return null;
          }
        })()}
      </LayoutFrame>
    </>
  );
}
