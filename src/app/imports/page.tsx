"use client";

import {
  Button,
  Card,
  CircularProgress,
  Step,
  stepClasses,
  StepIndicator,
  stepIndicatorClasses,
  Stepper,
  Typography,
  typographyClasses,
} from "@mui/joy";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import communityData from "./data/community.json";
import importCommunitys from "./data/community_2.json";
import PublishTwoToneIcon from "@mui/icons-material/PublishTwoTone";
import SendToMobileTwoToneIcon from "@mui/icons-material/SendToMobileTwoTone";
import Layout from "@/components/Layout";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useMutation } from "@tanstack/react-query";
import { Community, FloorRange } from "@/models/house";
import dayjs from "dayjs";
import http from "@/services/http";
import importHouses from "@/app/imports/data/house.json";
import house_rental from "@/app/imports/data/house_rental.json";
import house_second_hand from "@/app/imports/data/house_second_hand.json";

import { HouseForm, houseFormSchema } from "@/schema/house";
import { getCommunityList, saveHouse } from "@/services/house";

(global as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export default function Page() {
  const placeSearchRef = useRef<any>(null);
  const [communityCount, setCommunityCount] = useState(0);
  const communityProgress =
    (1 - communityCount / importCommunitys.length) * 100;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Community) => {
      setCommunityCount(importCommunitys.length);
      return http.post("/api/domus/management/community/save", data);
    },
    onSuccess: () => {
      setCommunityCount((communityCount) => communityCount - 1);
    },
  });

  const [houseCount, setHouseCount] = useState(0);
  const houseProgress = (1 - houseCount / importHouses.house.length) * 100;

  const { mutate: importsHousesMutate, isPending: importsHousesMutatePending } =
    useMutation({
      mutationFn: (data: HouseForm) => {
        setHouseCount(importHouses.house.length);
        return saveHouse(data);
      },
      onSuccess: (data) => {
        if (data.data.code !== 200) {
          return;
        }
        setHouseCount((houseCount) => houseCount - 1);
      },
    });

  useEffect(() => {
    (global as any).initMap = () => {
      AMap.plugin("AMap.AutoComplete", function () {
        var autoOptions = {
          city: "安庆",
        };

        placeSearchRef.current = new (AMap as any).AutoComplete(autoOptions);
      });
    };
  }, []);

  return (
    <>
      <Script
        src="https://webapi.amap.com/maps?v=2.0&key=beb2c304f924eedf108a4632603711b4&callback=initMap"
        strategy="afterInteractive"
      />
      <Layout.Root
        style={{ width: "100%" }}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Layout.Header>导入数据</Layout.Header>
        <Layout.Main
          sx={{
            display: {
              xs: "block",
              md: "block",
            },
          }}
        >
          <Card
            sx={{
              p: 5,
              height: "calc(100vh - 100px)",
            }}
          >
            <Stepper
              orientation="vertical"
              sx={(theme) => ({
                "--Stepper-verticalGap": "2.5rem",
                "--StepIndicator-size": "2.5rem",
                "--Step-gap": "1rem",
                "--Step-connectorInset": "0.5rem",
                "--Step-connectorRadius": "1rem",
                "--Step-connectorThickness": "4px",
                "--joy-palette-success-solidBg":
                  "var(--joy-palette-success-400)",
                [`& .${stepClasses.completed}`]: {
                  "&::after": { bgcolor: "success.solidBg" },
                },
                [`& .${stepClasses.active}`]: {
                  [`& .${stepIndicatorClasses.root}`]: {
                    border: "4px solid",
                    borderColor: "#fff",
                    boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
                  },
                },
                [`& .${stepClasses.disabled} *`]: {
                  color: "neutral.softDisabledColor",
                },
                [`& .${typographyClasses["title-sm"]}`]: {
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "10px",
                },
              })}
            >
              <Step
                completed
                indicator={
                  <StepIndicator variant="solid" color="success">
                    <CheckRoundedIcon />
                  </StepIndicator>
                }
              >
                <div>
                  <Typography level="title-sm">
                    在地图上导出小区 一共{communityData.length}
                  </Typography>
                  <Button
                    color="neutral"
                    variant="plain"
                    startDecorator={<SendToMobileTwoToneIcon />}
                    disabled
                  >
                    导出
                  </Button>
                </div>
              </Step>
              <Step
                completed
                indicator={
                  <StepIndicator
                    variant="solid"
                    color={communityProgress === 100 ? "success" : "primary"}
                    sx={{ p: 2 }}
                  >
                    {communityProgress === 100 ? (
                      <CheckRoundedIcon />
                    ) : (
                      <CircularProgress
                        thickness={4}
                        determinate
                        value={communityProgress}
                      />
                    )}
                  </StepIndicator>
                }
              >
                <div>
                  <Typography level="title-sm">导入小区数据</Typography>
                  <Button
                    color="neutral"
                    variant="plain"
                    startDecorator={<PublishTwoToneIcon />}
                    loading={isPending}
                    onClick={() => {
                      importCommunitys.forEach((item) => {
                        mutate({
                          id: item.id,
                          // 小区名称
                          name: item.name,
                          // 小区地址
                          address: item.address,
                          // 城市
                          city: item.city,
                          // 建成年份
                          year_built: item.item.year_built
                            ? dayjs(`${item.item.year_built}-01-01`).format()
                            : undefined,
                          // 小区描述
                          description: item.item.description!,
                          // 小区图片
                          images: [],
                          // 小区类型
                          typecode: item.typecode,
                          // 所属行政区（如“朝阳区”）
                          district: item.district,
                          // 所属行政区划代码（如“110105”，代表朝阳区）
                          adcode: item.adcode,
                          // 位置
                          lng: item.location[0],
                          lat: item.location[1],
                          property_management_company:
                            item.item.property_management_company || "",
                          remark: item.item.community_name,
                        });
                      });
                    }}
                  >
                    导入
                  </Button>
                </div>
              </Step>
              <Step
                active
                indicator={
                  <StepIndicator
                    variant="solid"
                    color={houseProgress === 100 ? "success" : "primary"}
                    sx={{ p: 2 }}
                  >
                    {houseProgress === 100 ? (
                      <CheckRoundedIcon />
                    ) : (
                      <CircularProgress
                        thickness={4}
                        determinate
                        value={houseProgress}
                      />
                    )}
                  </StepIndicator>
                }
              >
                <div>
                  <Typography level="title-sm">导入房源</Typography>
                  <Button
                    color="neutral"
                    variant="plain"
                    startDecorator={<PublishTwoToneIcon />}
                    loading={importsHousesMutatePending}
                    onClick={async () => {
                      try {
                        const houses = await getImportHouses();
                        console.log(houses.length);
                        for (const house of houses) {
                          importsHousesMutate(house);
                        }
                      } catch (error) {
                        console.error(error);
                        setHouseCount(0);
                      }
                    }}
                  >
                    导入
                  </Button>
                </div>
              </Step>
              <Step disabled indicator={<StepIndicator>3</StepIndicator>}>
                <div>
                  <Typography level="title-sm">Step 4</Typography>
                  Payment details
                </div>
              </Step>
            </Stepper>
          </Card>
        </Layout.Main>
      </Layout.Root>
    </>
  );

  async function exportCommunityByAMap() {
    const placeSearch = placeSearchRef.current;
    const not: any = [];
    const data = [];

    for (const item of communityData) {
      const res: any = await new Promise((resolve) => {
        placeSearch.search(
          item.community_name,
          function (_: any, result: SearchData) {
            const poi = result.tips?.[0];
            if (poi) {
              setTimeout(() => {
                resolve({
                  ...poi,
                  item,
                });
              }, 1000);
            } else {
              console.log(item.community_name, "未找到");
              not.push(item.community_name);
              setTimeout(() => {
                resolve({});
              }, 1000);
            }
          }
        );
      });

      data.push(res);
    }
  }
}

async function getImportHouses() {
  const {
    communityMap,
    houseRentalMap,
    houseSecondHandMap,
    getTransactionType,
  } = await getDataMap();

  type SyncHouse = (typeof importHouses.house)[0];
  // 不能同步的数据
  const not_sync: SyncHouse[] = [];
  const data: HouseForm[] = [];
  for (const item of importHouses.house) {
    const community = communityMap.get(item.community_name);
    if (community) {
      const houseRental = houseRentalMap.get(item.house_id);
      const houseSecondHand = houseSecondHandMap.get(item.house_id);

      const transaction_type = getTransactionType(item.house_id);

      if (!community) {
        console.log("小区为空", item, item.house_id);
        not_sync.push(item);
        continue;
      }

      const houseForm: HouseForm = {
        title: item.title,
        purpose: "住宅",
        transaction_type,
        house_status: "在售",
        house_address: item.house_address,
        floor_range:
          item.floor_range && !item.floor_range.includes("null")
            ? ({
                door_number_from: Number(item.floor_range.split("-")[0]),
                door_number_to: Number(item.floor_range.split("-")[1]),
              } as FloorRange)
            : undefined,
        apartment_type: {
          room: item.bedrooms,
          hall: item.living_rooms,
          bathroom: item.bathrooms,
          kitchen: item.kitchen,
          terrace: item.balcony,
          // 阁楼
          balcony: undefined,
        },

        building_area: item.area,
        use_area: item.usable_area || undefined,
        floor_height: undefined,
        house_decoration: item.decoration_status || undefined,
        // 售价
        sale_price: houseSecondHand?.pice,
        sale_low_price: houseSecondHand?.low_pice || undefined,
        // 租价
        rent_price: houseRental?.rent_pice,
        rent_low_price: houseRental?.rent_low_pice || undefined,

        // 首付
        down_payment: undefined,
        house_type: "住宅",
        house_orientation: item.orientation || undefined,
        building_structure: item.building_structure || undefined,
        building_year: item.building_year || undefined,
        property_rights: item.property_duration || undefined,
        certificate_date: item.property_date || undefined,
        handover_date: item.delivery_date || undefined,
        tags: item.recommended_tags.split(","),
        car_height: undefined,
        actual_rate: undefined,
        level: undefined,
        progress_depth: undefined,
        door_width: undefined,
        discount_year_limit: undefined,
        stairs:
          item.elevator && item.household
            ? {
                stairs: item.elevator.toString(),
                rooms: item.household.toString(),
              }
            : undefined,
        owner: {
          name: item.owner_name,
          phone: item.owner_phone,
        },
        community,
        view_method: undefined,
        payment_method: undefined,
        property_tax: undefined,
        degree: item.school_qualification || undefined,
        household: item.household_registration || undefined,
        source: item.source || undefined,
        delegate_number: undefined,
        unique_housing: !!item.unique_house ? "是" : "否",
        full_payment: undefined,
        mortgage: undefined,
        urgent: undefined,
        support: undefined,
        present_state: item.current_status || undefined,
        external_sync: "否",
        remark: item.house_description || undefined,
        images: [],
      };

      const house = houseFormSchema.parse(houseForm, {
        error: (issue) => {
          console.error(issue);
          return "";
        },
      });

      data.push(house);
    } else {
      not_sync.push(item);
    }
  }

  console.error("不能同步的数据", not_sync);

  return data;
}

async function getDataMap() {
  const communityMap = new Map<string, Community>();
  const communityList = await getCommunityList({ page: 1, page_size: 10000 });
  for (const item of communityList) {
    communityMap.set(item.remark!, item);
  }

  const houseRentalMap = new Map<
    string,
    (typeof house_rental.house_rental)[0]
  >();
  {
    for (const item of house_rental.house_rental) {
      houseRentalMap.set(item.house_id, item);
    }
  }

  const houseSecondHandMap = new Map<
    string,
    (typeof house_second_hand.house_second_hand)[0]
  >();
  {
    for (const item of house_second_hand.house_second_hand) {
      houseSecondHandMap.set(item.house_id, item);
    }
  }

  return {
    communityMap,
    houseRentalMap,
    houseSecondHandMap,
    getTransactionType(houseId: string) {
      if (houseRentalMap.has(houseId) && houseSecondHandMap.has(houseId)) {
        return "租售";
      }

      if (houseSecondHandMap.has(houseId)) {
        return "出售";
      } else if (houseRentalMap.has(houseId)) {
        return "出租";
      }

      return "租售";
    },
  };
}

export interface SearchData {
  info: string;
  count: number;
  tips: Poi[];
}

export interface Poi {
  id: string; // POI（地点）的唯一标识 ID（比如可以用于查询详情）
  name: string; // 地点名称（如“朝阳大悦城”）
  district: string; // 所属行政区（如“朝阳区”）
  adcode: string; // 所属行政区划代码（如“110105”，代表朝阳区）
  location: {
    // 坐标和位置信息（部分字段是内部属性）
    KL?: number; // 内部属性（可能是高德用于计算或缓存的值，可忽略）
    className?: string; // 类型标识（如 "AMap.LngLat"）
    kT?: string; // 内部属性，通常表示经纬度字符串（"lng,lat" 格式）
    lat: number; // 纬度（如 "39.9235"）
    lng: number; // 经度（如 "116.428"）
    pos?: [number, number]; // 坐标数组：[经度, 纬度]，用于直接在地图上定位
  };
  address: string; // 详细地址（如“北京市朝阳区朝阳北路101号”）
  typecode: string; // POI 类型编码（如 "060100" 表示“汽车服务”）
  city?: string[]; // 所属城市（可能为空数组或 ["北京"]，注意是数组）
}
