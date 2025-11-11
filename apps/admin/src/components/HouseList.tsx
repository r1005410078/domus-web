import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  Chip,
  Drawer,
  List,
  ListItem,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Layout from "./Layout";
import { apartmentTypeToString, HouseForm } from "@/models/house";
import Filters, { FiltersForm } from "./Filters";
import Pagination, { PaginationProps } from "./Pagination";
import React, { memo, useMemo } from "react";
import { isMobile } from "@/utils";
import dynamic from "next/dynamic";
import { EmptyState } from "./EmptyState";
import { AmapBounds, Points } from "@/components/AMap";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { getHouseDataByColDef } from "./HouseTableConfig";
import { HouseData, houseDataFuseKeys } from "@/schema/house";

const DynamicAMapComponent = dynamic(() => import("@/components/AMap"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

const DynamicDetailComponent = dynamic(() => import("@/components/Detail"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

export interface HouseListProps {
  houseList: HouseData[];
  onPullLoadMore?: () => void;
  pagination?: PaginationProps;
  onFilterSubmit?: (values: FiltersForm) => void;
  transactionType?: string;
  loading?: boolean;
  isFetched?: boolean;
}

function HouseList({
  pagination,
  houseList,
  loading,
  isFetched,
  onFilterSubmit,
  onPullLoadMore,
  transactionType,
}: HouseListProps) {
  const [detail, setDetail] = React.useState<HouseForm>();

  const [amapBounds, setAmapBounds] = React.useState<AmapBounds | null>(null);

  // 全局检索
  const { fuseRowData, fuseSearchNode } = useFuseSearch(
    getHouseDataByColDef(houseList),
    {
      keys: houseDataFuseKeys, // 要模糊搜索的字段
      threshold: 0.6,
      loading,
    }
  );

  const aMapData = React.useMemo(() => {
    return (
      fuseRowData.map((item) => {
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
  }, [fuseRowData]);

  // 根据地图bounds进行过滤
  const houseListByAmapBounds = React.useMemo(() => {
    if (amapBounds) {
      return fuseRowData.filter((item) => {
        return (
          item.community.lng >= amapBounds.south_west.lng &&
          item.community.lng <= amapBounds.north_east.lng &&
          item.community.lat >= amapBounds.south_west.lat &&
          item.community.lat <= amapBounds.north_east.lat
        );
      });
    }

    return fuseRowData;
  }, [amapBounds, fuseRowData]);

  const onMapBoundsChange = React.useCallback((bounds: AmapBounds) => {
    setAmapBounds(bounds);
  }, []);

  return (
    <>
      <Layout.SidePane>
        <Stack
          spacing={0}
          onScroll={(event) => {
            const target = event.currentTarget;
            const { scrollTop, scrollHeight, clientHeight } = target;
            const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 留一点误差
            if (isBottom) {
              // 触发加载更多数据等逻辑
              onPullLoadMore?.();
            }
          }}
        >
          {onFilterSubmit ? (
            <Filters
              key={transactionType}
              transactionType={transactionType}
              onFilterSubmit={onFilterSubmit}
            >
              {fuseSearchNode}
            </Filters>
          ) : (
            <Box sx={{ p: 1, pb: 0 }}>{fuseSearchNode}</Box>
          )}
          <List
            sx={{
              "--ListDivider-gap": "11px",
              "--ListItem-paddingY": "8px",
              overflow: "auto",
              p: 0,
              height: {
                xs: pagination ? "calc(100vh - 110px)" : "calc(100vh - 120px)",
                md: pagination ? "calc(100vh - 110px)" : "calc(100vh - 120px)",
              },
            }}
          >
            <EmptyState
              isEmpty={houseListByAmapBounds?.length === 0 && !!isFetched}
            >
              {houseListByAmapBounds?.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => {
                    setDetail(item);
                  }}
                >
                  <Card
                    variant="outlined"
                    orientation="horizontal"
                    sx={{
                      width: "100%",
                      p: 0,
                      border: "none",
                      "&:hover": {
                        boxShadow: "md",
                        borderColor: "neutral.outlinedHoverBorder",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <AspectRatio ratio="1.2" sx={{ width: 120 }}>
                      <img
                        srcSet={
                          item.images?.[0]?.url ?? "/images/shooting.png 2x"
                        }
                        loading="lazy"
                      />
                    </AspectRatio>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Typography level="title-lg" id="card-description">
                        {item.title ?? item.community?.address ?? "-"}
                      </Typography>
                      <Typography
                        level="body-sm"
                        aria-describedby="card-description"
                        sx={{ mb: 1 }}
                      >
                        {[
                          apartmentTypeToString(item.apartment_type),
                          (item.building_area ?? item.use_area ?? 1) + "㎡",
                          item.community?.name,
                        ]
                          .filter(Boolean)
                          .join("/")}
                      </Typography>
                      <Stack
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: "wrap" }}
                        spacing={1}
                      >
                        {item.tags
                          ?.filter((it) => it)
                          ?.map((tag) => (
                            <Chip
                              key={tag}
                              variant="outlined"
                              color="primary"
                              size="sm"
                              sx={{ pointerEvents: "none" }}
                            >
                              {tag}
                            </Chip>
                          ))}
                      </Stack>
                      {((item.transaction_type === "出售" && item.sale_price) ||
                        (item.transaction_type === "出租" &&
                          item.rent_price)) && (
                        <Typography
                          sx={{ fontSize: "lg", fontWeight: "lg" }}
                          color="danger"
                        >
                          {item.transaction_type === "出售"
                            ? (item.sale_price || "- ") + "万元"
                            : (item.rent_price || "- ") + "元/月"}
                          {item.transaction_type === "出售" && (
                            <Typography level="body-xs" ml={1}>
                              ¥
                              {(
                                (item.sale_price! * 10000) /
                                (item.building_area ?? item.use_area ?? 1)
                              ).toFixed(2)}
                              元/平
                            </Typography>
                          )}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </EmptyState>
          </List>
        </Stack>
        {pagination && <Pagination {...pagination} />}
      </Layout.SidePane>
      <Layout.Main sx={{ p: 0, position: "relative" }}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: { xs: "none", md: "initial" },
          }}
        >
          {!isMobile && (
            <DynamicAMapComponent
              points={aMapData}
              onMapBoundsChange={onMapBoundsChange}
            />
          )}
        </Box>
        {detail && !isMobile && (
          <Sheet
            sx={{
              position: "absolute",
              zIndex: 999,
              top: "0",
              display: { xs: "none", md: "initial" },
              width: "430px",
              height: "calc(100vh - 64px)",
              overflow: "auto",
            }}
          >
            <DynamicDetailComponent
              key={detail.id}
              house_id={detail.id}
              transactionType={detail.transaction_type}
              onClose={() => setDetail(undefined)}
            />
          </Sheet>
        )}
      </Layout.Main>

      <Drawer
        anchor="bottom"
        sx={{
          display: { xs: "initial", md: "none" },
        }}
        slotProps={{
          content: {
            sx: {
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              borderRadius: 0,
              boxShadow: "lg",
              p: 0,
              backgroundColor: "background.body",
              overflow: "auto",
            },
          },
        }}
        open={!!detail}
        size="lg"
        onClose={() => setDetail(undefined)}
      >
        {detail && (
          <DynamicDetailComponent
            house_id={detail.id}
            transactionType={detail.transaction_type}
            onClose={() => setDetail(undefined)}
          />
        )}
      </Drawer>
    </>
  );
}

export default memo(HouseList);
