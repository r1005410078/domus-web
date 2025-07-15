"use client";

import * as React from "react";
import LayoutFrame from "@/components/LayoutFrame";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import { Box, DialogTitle, Drawer, ModalClose, Sheet } from "@mui/joy";
import Layout from "@/components/Layout";
import { HouseList } from "@/components/HouseList";
import { HouseForm } from "@/models/house";
import House from "@/components/House";
import { CommunityTable } from "@/components/CommunityTable";
import { HouseTable } from "@/components/HouseTable";
import { useGetCommunityByCommunity, useHouseList } from "@/hooks/useHouse";
import { HouseListRequest } from "@/services/house";
import { useDebouncedCallback } from "use-debounce";
import { PaginationProps } from "@/components/Pagination";

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
  },
  {
    label: "小区",
    key: "community",
    icon: <MapsHomeWorkTwoToneIcon />,
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
    React.useState<keyof typeof gridTemplateColumns>("community");
  const [drawerAddOpen, setDrawerAddOpen] = React.useState(false);
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
  const setHouseListRequestDebounced = useDebouncedCallback(
    (value: HouseListRequest) => {
      setHouseListRequest({
        ...houseListRequest,
        ...value,
      });
    },
    300
  );

  return (
    <>
      <LayoutFrame
        rootProps={{
          sx: {
            gridTemplateColumns: gridTemplateColumns[transaction_type],
          },
        }}
        onAdd={() => {
          setDrawerAddOpen(true);
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
                  data={houseList}
                  pagination={pagination}
                  transactionType={transaction_type}
                  aMapData={aMapData}
                  onMapBoundsChange={(amap_bounds) => {
                    setHouseListRequestDebounced({
                      ...houseListRequest,
                      amap_bounds,
                    });
                  }}
                />
              );
            case "house":
              return (
                <Layout.Main sx={{ p: 2, position: "relative" }}>
                  <HouseTable rowData={sale} onChangeRowData={() => {}} />
                </Layout.Main>
              );
            case "community":
              return (
                <Layout.Main sx={{ p: 2, position: "relative" }}>
                  <CommunityTable />
                </Layout.Main>
              );
            default:
              return null;
          }
        })()}
      </LayoutFrame>
      <Drawer
        anchor="bottom"
        sx={{}}
        slotProps={{
          content: {
            sx: {
              height: "100vh",
              width: { xs: "100%", md: "430px" },
              top: 0,
              left: { xs: 0, md: "calc(50% - 215px)" },
              borderRadius: 0,
              boxShadow: "lg",
              p: 0,
              backgroundColor: "background.body",
              overflow: "auto",
            },
          },
        }}
        open={drawerAddOpen}
        onClose={() => setDrawerAddOpen(false)}
      >
        <ModalClose />
        <DialogTitle>添加房源</DialogTitle>
        <Box sx={{ height: "100%", width: { xs: "100%", md: "430px" } }}>
          <House.Form />
        </Box>
      </Drawer>
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

// 出售
const sale: HouseForm[] = [
  {
    purpose: "住宅",
    transaction_type: "出售",
    house_status: "在售",
    title: "这是一个出售房源",
    sale_price: 120,
    sale_low_price: 11,
    down_payment: 2,
    building_area: 125,
    apartment_type: {
      room: 2,
      hall: 1,
      bathroom: 1,
      kitchen: 1,
      terrace: 1,
      balcony: 1,
    },
    tags: ["近地铁", "近公交", "学区好"],
    community: {
      name: "东安花园",
      typecode: "",
      lat: 0,
      lng: 0,
      address: "华中路与港华路交叉口东北100米",
      district: "华中路与港华路交叉口东北100米",
      adcode: "",
      id: "",
      city: "",
    },
  },
];
