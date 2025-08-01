"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import { useParams, useRouter } from "next/navigation";
import RentalAndSaleHouseList from "@/components/RentalAndSaleHouseList";

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
];

const transactionType = {
  sold: "出售",
  rent: "出租",
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
            default:
              return null;
          }
        })()}
      </LayoutFrame>
    </>
  );
}
