"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import Layout from "@/components/Layout";
import HouseList from "@/components/HouseList";

import { useHouseList } from "@/hooks/useHouse";
import { HouseListRequest } from "@/services/house";
import { PaginationProps } from "@/components/Pagination";
import dynamic from "next/dynamic";
import { AmapBounds, Points } from "@/components/AMap";
import { FiltersForm } from "@/components/Filters";
import { useParams, useSearchParams } from "next/navigation";

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
    params.get("type") || "出售"
  );

  console.log("params", params);

  const [amapBounds, setAmapBounds] = React.useState<AmapBounds | null>(null);
  const [houseListRequest, setHouseListRequest] =
    React.useState<HouseListRequest>({
      page: 1,
      page_size: 5000,
      transaction_type,
    });

  const { data, isFetched, isFetching } = useHouseList(
    houseListRequest,
    ["出售", "出租"].includes(transaction_type)
  );

  const aMapData = React.useMemo(() => {
    return (
      data?.list?.map((item) => {
        // area 使用公共前缀方法找到共同前缀
        const points: Points = {
          area: item.community.name,
          building: item.house_address,
          city: item.community.city,
          community: `
          <details style="margin-left: 6px">
              <summary>${item.community.name.replace(".", "")}</summary>
              <p>${item.community.address}</p>
            </details>
          `,
          district: item.community
            .district!.replace("安徽省", "")
            .replace("安庆市", ""),

          lnglat: {
            lng: item.community.lng,
            lat: item.community.lat,
          },
        };

        return points;
      }) || []
    );
  }, [data]);

  const houseList = data?.list || [];

  const houseListByAmapBounds = React.useMemo(() => {
    if (amapBounds) {
      return houseList.filter((item) => {
        return (
          item.community.lng >= amapBounds.south_west.lng &&
          item.community.lng <= amapBounds.north_east.lng &&
          item.community.lat >= amapBounds.south_west.lat &&
          item.community.lat <= amapBounds.north_east.lat
        );
      });
    }
    return houseList;
  }, [amapBounds, houseList]);

  const onMapBoundsChange = React.useCallback((bounds: AmapBounds) => {
    setAmapBounds(bounds);
  }, []);

  const onFilterSubmit = React.useCallback((values: FiltersForm) => {
    setHouseListRequest((pre) => ({
      ...pre,
      ...values,
      amap_bounds: pre.amap_bounds,
      page: pre.page,
      page_size: pre.page_size,
    }));
  }, []);

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
              return (
                <HouseList
                  loading={isFetching}
                  isFetched={isFetched}
                  data={houseListByAmapBounds}
                  transactionType={transaction_type}
                  aMapData={aMapData}
                  onFilterSubmit={onFilterSubmit}
                  onMapBoundsChange={onMapBoundsChange}
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
            default:
              return null;
          }
        })()}
      </LayoutFrame>
    </>
  );
}
