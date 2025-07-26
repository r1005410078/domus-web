import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import type { AmapBounds, CommunityWithHouseCount } from "@/components/AMap";
import { Detail } from "./Detail";
import React from "react";
import { isMobile } from "@/utils";
import dynamic from "next/dynamic";
import { EmptyState } from "./EmptyState";
const DynamicAMapComponent = dynamic(() => import("@/components/AMap"), {
  loading: () => <p>加载中...</p>,
});

export interface HouseListProps {
  data: HouseForm[];
  transactionType: string;
  aMapData: CommunityWithHouseCount[];
  onMapBoundsChange?: (bounds: AmapBounds) => void;
  loading?: boolean;
  isFetched?: boolean;
  onPullLoadMore?: () => void;
  pagination: PaginationProps;
  onFilterSubmit: (values: FiltersForm) => void;
}

export function HouseList({
  data,
  transactionType,
  aMapData,
  loading,
  isFetched,
  pagination,
  onMapBoundsChange,
  onPullLoadMore,
  onFilterSubmit,
}: HouseListProps) {
  const [detail, setDetail] = React.useState<HouseForm>();
  return (
    <>
      <Layout.SidePane>
        <Stack
          spacing={0}
          sx={{
            overflow: "auto",
          }}
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
          <List
            sx={{
              "--ListDivider-gap": "11px",
              "--ListItem-paddingY": "8px",

              height: {
                xs: "calc(100vh - 200px)",
                md: "calc(100vh - 110px)",
              },
            }}
          >
            <Filters
              key={transactionType}
              transactionType={transactionType}
              onFilterSubmit={onFilterSubmit}
              loading={loading}
            />
            <EmptyState isEmpty={data.length === 0 && !!isFetched}>
              {data.map((item) => (
                <ListItem key={item.id} onClick={() => setDetail(item)}>
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
                      {((transactionType === "出售" && item.sale_price) ||
                        (transactionType === "出租" && item.rent_price)) && (
                        <Typography
                          sx={{ fontSize: "lg", fontWeight: "lg" }}
                          color="danger"
                        >
                          {transactionType === "出售"
                            ? (item.sale_price || "- ") + "万元"
                            : (item.rent_price || "- ") + "元/月"}
                          {transactionType === "出售" && (
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
        <Pagination {...pagination} />
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
              data={aMapData}
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
            <Detail
              house_id={detail.id}
              transactionType={transactionType}
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
          <Detail
            house_id={detail.id}
            transactionType={transactionType}
            onClose={() => setDetail(undefined)}
          />
        )}
      </Drawer>
    </>
  );
}
