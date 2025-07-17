import {
  AspectRatio,
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
import Filters from "./Filters";
import Pagination, { PaginationProps } from "./Pagination";
import {
  AmapBounds,
  AMapComponent,
  CommunityWithHouseCount,
} from "@/components/AMap";
import { Detail } from "./Detail";
import React from "react";

export interface HouseListProps {
  data: HouseForm[];
  transactionType?: string;
  aMapData: CommunityWithHouseCount[];
  onMapBoundsChange?: (bounds: AmapBounds) => void;
  loading?: boolean;
  onPullLoadMore?: () => void;
  pagination: PaginationProps;
}

interface FilterForm {
  purpose?: string[];
}

export function HouseList({
  data,
  transactionType,
  aMapData,
  loading,
  pagination,
  onMapBoundsChange,
  onPullLoadMore,
}: HouseListProps) {
  const [detail, setDetail] = React.useState<HouseForm>();
  const [filterFrom, setFilterFrom] = React.useState<FilterForm>({});

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
              purposeSelectorProps={{
                value: filterFrom.purpose,
                onChange: (value) => {
                  setFilterFrom({
                    ...filterFrom,
                    purpose: value,
                  });
                },
              }}
            />
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
                  <AspectRatio ratio="1.2" sx={{ width: 140 }}>
                    <img
                      srcSet={
                        item.images?.[0]?.url ?? "/images/shooting.png 2x"
                      }
                      loading="lazy"
                    />
                  </AspectRatio>
                  <CardContent>
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
                      {item.tags?.map((tag) => (
                        <Chip
                          variant="outlined"
                          color="primary"
                          size="sm"
                          sx={{ pointerEvents: "none" }}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </Stack>
                    <Typography
                      sx={{ fontSize: "lg", fontWeight: "lg" }}
                      color="danger"
                    >
                      {transactionType === "出售"
                        ? item.sale_price + "万元"
                        : item.rent_price + "元/月"}
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
                  </CardContent>
                </Card>
              </ListItem>
            ))}
            {/* <Box
              className="Pagination-mobile"
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "center",
                mx: 2,
                my: 1,
              }}
            >
              <Button
                aria-label="previous page"
                variant="plain"
                color="neutral"
                size="sm"
                startDecorator={<ReplayCircleFilledTwoToneIcon />}
                onClick={() => {}}
              >
                加载更多
              </Button>
            </Box> */}
          </List>
        </Stack>
        <Pagination {...pagination} />
      </Layout.SidePane>
      <Layout.Main sx={{ p: 0, position: "relative" }}>
        <AMapComponent data={aMapData} onMapBoundsChange={onMapBoundsChange} />

        {detail && (
          <Sheet
            sx={{
              position: "absolute",
              zIndex: 1,
              top: "0",
              display: { xs: "none", md: "initial" },
              width: "430px",
              height: "calc(100vh - 64px)",
              overflow: "auto",
            }}
          >
            <Detail
              detail={detail}
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
            detail={detail}
            transactionType={transactionType}
            onClose={() => setDetail(undefined)}
          />
        )}
      </Drawer>
    </>
  );
}
