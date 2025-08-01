"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Box, ButtonGroup, IconButton, Radio, RadioGroup } from "@mui/joy";
import clsx from "clsx";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useSearchParams } from "next/navigation";

const snapPoints = ["200px", 0.52, 1];

(globalThis as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

const searchTypeMap = new Map([
  ["交通设施服务", "交通"],
  ["科教文化服务", "教育"],
  ["风景名胜", "风景"],
  ["医疗保健服务", "医疗"],
  ["餐饮服务", "餐饮"],
]);

export default function NearbyPoi() {
  const [AMap, setAMap] = useState<any>(null);
  const [snap, setSnap] = useState<number>(snapPoints[0] as number);
  const [placeSearchType, setPlaceSearchType] = useState<string>(
    searchTypeMap.get("交通设施服务") as string
  );
  const searchParams = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let mapRef = useRef<any>(null);

  useEffect(() => {
    if (!AMap) return;
    //构造地点查询类
    const placeSearch = new AMap.PlaceSearch({
      type: placeSearchType, // 兴趣点类别  交通设施服务 科教文化服务 政府机构及社会团体 商务住宅 风景名胜 医疗保健服务 餐饮服务
      pageSize: snap >= 1 ? 10 : 4, // 单页显示结果条数
      pageIndex: 1, // 页码
      city: "安庆", // 兴趣点城市
      citylimit: true, //是否强制限制在设置的城市内搜索
      map: mapRef.current, // 展现结果的地图实例
      panel: "panel", // 结果列表将在此容器中进行展示。
      extensions: "all",
      autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    });

    const cpoint = [lng, lat]; //中心点坐标
    placeSearch.searchNearBy(
      "food",
      cpoint,
      1000,
      function (status: any, result: any) {
        var marker = new AMap.Marker({
          // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          position: [lng, lat],
        });
        marker.add(mapRef.current);
      }
    );

    return () => {
      placeSearch.clear();
    };
  }, [AMap, placeSearchType, snap]);

  useEffect(() => {
    AMapLoader.load({
      key: "beb2c304f924eedf108a4632603711b4", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale", "AMap.PlaceSearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        mapRef.current = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 16, // 初始化地图级别
          center: [lng, lat], // 初始化地图中心点位置
          resizeEnable: true,
        });

        setAMap(AMap);
      })
      .catch((e) => {
        console.error("111", e);
      });

    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap as any}
      snapToSequentialPoint
      open
      modal={false}
    >
      <div className="fixed top-4 left-4 z-[9999]">
        <ButtonGroup
          size="lg"
          aria-label="radius button group"
          sx={{ "--ButtonGroup-radius": "30px", bgcolor: "background.surface" }}
        >
          <IconButton onClick={() => history.back()}>
            <ArrowBackTwoToneIcon />
          </IconButton>
          <IconButton onClick={() => (location.href = "/")}>
            <HomeOutlinedIcon />
          </IconButton>
        </ButtonGroup>
      </div>
      <div id="container" className="w-[100wh] h-[100vh]"></div>
      <Drawer.Overlay className="fixed inset-0 bg-black/40"></Drawer.Overlay>
      <Drawer.Portal>
        <Drawer.Content
          data-testid="content"
          className="fixed flex z-[9999] flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
        >
          <div
            className={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
              "overflow-y-auto": snap === 1,
              "overflow-hidden": snap !== 1,
            })}
          >
            <Drawer.Handle />
            <Box sx={{ pt: 2 }}>
              <RadioGroup
                orientation="horizontal"
                aria-labelledby="segmented-controls-example"
                name="justify"
                value={placeSearchType}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPlaceSearchType(event.target.value)
                }
                sx={{
                  minHeight: 48,
                  padding: "6px",
                  borderRadius: "8px",
                  bgcolor: "neutral.softBg",
                  "--RadioGroup-gap": "4px",
                  "--Radio-actionRadius": "8px",
                  justifyContent: "space-around",
                }}
              >
                {Array.from(searchTypeMap.values()).map((item) => (
                  <Radio
                    key={item}
                    color="neutral"
                    value={item}
                    disableIcon
                    label={item}
                    variant="plain"
                    sx={{ px: 2, alignItems: "center" }}
                    slotProps={{
                      action: ({ checked }) => ({
                        sx: {
                          ...(checked && {
                            bgcolor: "background.surface",
                            boxShadow: "sm",
                            "&:hover": {
                              bgcolor: "background.surface",
                            },
                          }),
                        },
                      }),
                    }}
                  />
                ))}
              </RadioGroup>
              <div id="panel"></div>
            </Box>
            <style jsx global>{`
              #panel .amap_lib_placeSearch {
                border-style: none !important;
              }

              #panel .poibox {
                border-style: none;
              }

              #panel .pageLink {
                padding: 2px 5px;
              }

              .amap_lib_placeSearch_page > div > p > span {
                height: initial !important;
                font-size: 14px;
                border: 0px solid #ccc;
                border-radius: 50%;
              }

              .amap_lib_placeSearch .amap_lib_placeSearch_page .current {
                font-size: 15px;
                font-weight: bold;
              }

              html,
              body {
                overscroll-behavior: contain;
                touch-action: pan-y;
              }
            `}</style>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
