"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Filters from "@/components/rental-dashbord/Filters";
import Pagination from "@/components/rental-dashbord/Pagination";
import { MapPage } from "@/components/AMap";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/Header";
import {
  AspectRatio,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import { useHouseList } from "@/hooks/useHouse";
import { HouseListRequest } from "@/services/house";
import { ApartmentType } from "@/models/house";

export default function RentalDashboard() {
  const [params, setParams] = React.useState<HouseListRequest>({
    page: 1,
    page_size: 10,
    transaction_type: "出售",
  });

  const { data, isFetching } = useHouseList(params);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Box
        component="main"
        sx={{
          height: "calc(100vh - 55px)", // 55px is the height of the NavBar
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "430px auto" },
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Box />
        <Box
          sx={{
            gridRow: "span 3",
            display: { xs: "none", md: "flex" },
          }}
        >
          <MapPage />
        </Box>
        <Stack spacing={2} sx={{ px: { xs: 1, md: 2 }, pt: 2, minHeight: 0 }}>
          <Filters
            orderSelectorProps={{
              onChange: (value) => {
                setParams({ ...params, transaction_type: value });
              },
              value: params.transaction_type,
            }}
          />
          {isFetching ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress thickness={1} />
            </Box>
          ) : (
            <List
              sx={{
                "--List-gap": "12px",
                overflow: "auto",
              }}
            >
              {data?.list.map((item) => (
                <ListItem sx={{ p: 0 }}>
                  <Card
                    variant="outlined"
                    orientation="horizontal"
                    sx={{
                      width: "100%",
                      p: 1,
                      border: "none",
                      "&:hover": {
                        boxShadow: "md",
                        borderColor: "neutral.outlinedHoverBorder",
                      },
                    }}
                  >
                    <AspectRatio ratio="1.2" sx={{ width: 130 }}>
                      <img
                        srcSet={
                          item.images?.[0].url ?? "/images/shooting.png 2x"
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
                      <Stack direction="row" spacing={1}>
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
                        {params.transaction_type === "出售"
                          ? item.sale_price + "万元"
                          : item.rent_price + "元/月"}
                        {params.transaction_type === "出售" && (
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
            </List>
          )}
        </Stack>
        <Pagination />
      </Box>
    </CssVarsProvider>
  );
}

export function apartmentTypeToString(data?: ApartmentType) {
  let str = "";

  if (data?.room) {
    str += `${data.room}室`;
  }

  if (data?.hall) {
    str += `${data.hall}厅`;
  }

  if (data?.bathroom) {
    str += `${data.bathroom}卫`;
  }

  if (data?.kitchen) {
    str += `${data.kitchen}厨`;
  }

  if (data?.terrace) {
    str += `${data.terrace}阳台`;
  }

  return str;
}
