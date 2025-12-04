"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import SupportAgent from "@mui/icons-material/SupportAgent";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import RentalAndSaleHouseList from "@/components/RentalAndSaleHouseList";
import FavoritesHouseList from "@/components/FavoritesHouseList";
import QuickNote from "@/components/QuickNote";

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
  {
    label: "房源随手记",
    key: "quick_note",
    icon: <SupportAgent />,
  },
];

const transactionType = {
  sold: "出售",
  rent: "出租",
  house: "房源",
  community: "小区",
  quick_note: "房源随手记",
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
    md: "minmax(160px, 260px) 1fr",
  },
  community: {
    xs: "1fr",
    md: "minmax(160px, 260px) 1fr",
  },
  quick_note: {
    xs: "1fr",
    md: "minmax(160px, 260px) 1fr",
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
              return (
                <RentalAndSaleHouseList
                  transactionType={transactionType[nav]}
                />
              );
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
            case "quick_note":
              return <QuickNote />;
            default:
              const category_id = Number(nav);
              if (!Number.isNaN(category_id)) {
                return <FavoritesHouseList category_id={category_id} />;
              }

              return null;
          }
        })()}
      </LayoutFrame>
    </>
  );
}
