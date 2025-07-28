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
import { useSearchParams } from "next/navigation";

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
    key: "出售",
    icon: <OutboxRoundedIcon />,
  },
  {
    label: "出租",
    key: "出租",
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

const gridTemplateColumns = {
  出售: {
    xs: "1fr",
    md: "minmax(160px, 260px) minmax(260px, 430px) minmax(430px, 1fr)",
  },
  出租: {
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
  const params = useSearchParams();
  const [transaction_type, onChangeTransactionType] = React.useState<string>(
    params.get("nav") || "出售"
  );

  return (
    <>
      <LayoutFrame
        rootProps={{
          sx: {
            // @ts-ignore
            gridTemplateColumns: gridTemplateColumns[transaction_type],
          },
        }}
        tabBar={{
          items: tabBarItems,
          value: transaction_type,
          onChange: onChangeTransactionType,
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
          switch (transaction_type) {
            case "出售":
            case "出租":
              return <HouseList transactionType={transaction_type} />;
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
