"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import Layout from "@/components/Layout";
import { HouseList } from "@/components/HouseList";

import { useGetCommunityByCommunity, useHouseList } from "@/hooks/useHouse";
import { HouseListRequest } from "@/services/house";
import { PaginationProps } from "@/components/Pagination";
import dynamic from "next/dynamic";
const DynamicHouseTable = dynamic(() => import("@/components/HouseTable"), {
  loading: () => <p>加载中...</p>,
});

const DynamicCommunityTable = dynamic(
  () => import("@/components/CommunityTable"),
  {
    loading: () => <p>加载中...</p>,
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
  const [transaction_type, onChangeTransactionType] =
    React.useState<keyof typeof gridTemplateColumns>("house");
  const [houseListRequest, setHouseListRequest] =
    React.useState<HouseListRequest>({
      page: 1,
      page_size: 10,
      transaction_type,
    });

  const { data, isFetching } = useHouseList(
    houseListRequest,
    ["出售", "出租"].includes(transaction_type)
  );

  const houseList = data?.list || [];
  const pagination: PaginationProps = {
    count: data?.total || 0,
    page: houseListRequest.page,
    pageSize: houseListRequest.page_size,
    onChange: (page) => {
      setHouseListRequest({
        ...houseListRequest,
        page,
      });
    },
  };

  const { data: aMapData = [] } = useGetCommunityByCommunity();

  return (
    <>
      <LayoutFrame
        rootProps={{
          sx: {
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
                  key={transaction_type}
                  loading={isFetching}
                  data={houseList}
                  pagination={pagination}
                  transactionType={transaction_type}
                  aMapData={aMapData}
                  onFilterSubmit={(values) => {
                    setHouseListRequest((pre) => ({
                      ...pre,
                      ...values,
                      amap_bounds: pre.amap_bounds,
                      page: pre.page,
                      page_size: pre.page_size,
                    }));
                  }}
                  onMapBoundsChange={(amap_bounds) => {
                    setHouseListRequest((pre) => ({
                      ...pre,
                      amap_bounds,
                    }));
                  }}
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

const aMapData = [
  // 小区
  {
    id: "1",
    // 小区名称
    name: "回祥小区",
    // 小区地址
    address: "安徽省安庆市宜秀区",
    // 所属区域
    district: "朝阳区",
    // 所属行政区划代码（如“110105”，代表朝阳区）
    adcode: "110105",
    // 小区坐标
    lng: 117.065439,
    lat: 30.537141,
    // 个数
    house_count: 2,
  },
  {
    id: "2",
    // 小区名称
    name: "红旗小区",
    // 小区地址
    address: "安徽省安庆市迎江区",
    // 所属区域
    district: "朝阳区",
    // 所属行政区划代码（如“110105”，代表朝阳区）
    adcode: "340802",
    // 小区坐标
    lng: 117.081381,
    lat: 30.512622,
    // 个数
    house_count: 7,
  },
  {
    id: "B022C05S27",
    name: "月亮城小区",
    district: "安徽省安庆市大观区",
    // 所属行政区划代码（如“110105”，代表朝阳区）
    address: "玉虹街",
    adcode: "340803",
    // 小区坐标
    lng: 117.034372,
    lat: 30.506398,
    // 个数
    house_count: 11,
  },
];
