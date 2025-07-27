"use client";

import { useEffect, useRef, useState } from "react";
import "@amap/amap-jsapi-types";
import { Select, useColorScheme, Option, Box } from "@mui/joy";
import { useAMap, useBindAMapToolBar } from "@/hooks/useAMap";

export interface CommunityWithHouseCount {
  // 小区
  id: string;
  // 小区名称
  name: string;
  // 小区地址
  address: string;
  // 所属区域
  district: string;
  // 所属行政区划代码（如“110105”，代表朝阳区）
  adcode: string;
  // 小区坐标
  lat: number;
  lng: number;
  // 个数
  house_count: number;
}

interface MapPageProps {
  data: CommunityWithHouseCount[];
  onMapBoundsChange?: (bounds: AmapBounds) => void;
}

export interface AmapBounds {
  north_east: { lng: number; lat: number };
  south_west: { lng: number; lat: number };
}

export default function AMapComponent({
  data,
  onMapBoundsChange,
}: MapPageProps) {
  const { amap, AMap } = useAMap("home-map-container");
  const polygons = useRef<any[]>([]);
  const clearPolygons = () => {
    polygons.current.forEach((polygon) => polygon.setMap(null));
    polygons.current = [];
  };

  // 绑定工具
  useBindAMapToolBar(amap, AMap);

  // 绑定地图移动与缩放事件
  useEffect(() => {
    if (!amap) return;
    //显示当前地图边界范围坐标
    const logMapBounds = () => {
      var bounds = amap.getBounds();
      onMapBoundsChange?.({
        north_east: {
          lng: bounds.getNorthEast().lng,
          lat: bounds.getNorthEast().lat,
        },
        south_west: {
          lng: bounds.getSouthWest().lng,
          lat: bounds.getSouthWest().lat,
        },
      });
    };

    logMapBounds();

    let callback = debounce(logMapBounds, 300);
    //绑定地图移动与缩放事件
    amap.on("moveend", callback);
    amap.on("zoomend", callback);

    return () => {
      amap.off("moveend", callback);
      amap.off("zoomend", callback);
    };
  }, [amap]);

  // 点聚合
  useEffect(() => {
    if (!amap || data.length === 0) return;
    const points = data.map((item) => {
      return {
        lnglat: [item.lng, item.lat],
        item,
      };
    });

    const _renderMarker = function (context: any) {
      for (var i = 0; i < context.data.length; i++) {
        const item = context.data[i].item;
        const content = `
   <div style="position: relative; display: inline-block;">
  <div style="
     display: inline-flex;
    align-items: center;
    background-color: #FFF8E1;
    border: 1px solid #FFB74D;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    color: #E65100;
    white-space: nowrap;
    font-weight: 500;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  ">
    🏡 ${item.name} · <span style="margin-left: 6px; color: #D84315;">${item.house_count} 套</span>
  </div>
  <div style="
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #FFB74D;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
  "></div>
</div>
          `;

        var offset = new AMap.Pixel(-9, -9);

        context.marker.setContent(content);
        context.marker.setOffset(offset);
      }
    };

    const cluster = new AMap.MarkerCluster(amap, points, {
      gridSize: 50, // 设置网格像素大小
      // renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
      renderMarker: _renderMarker, // 自定义非聚合点样式
      renderClusterMarker: function (context: any) {
        console.log(context);
        const count = context.count;
        const div = document.createElement("div");
        div.innerHTML = `
      <div style="
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #5C6BC0, #3F51B5);
  color: #fff;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  position: relative;
  white-space: nowrap;
">
  🏡 共 ${count} 套
  <div style="
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #3F51B5;
    filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.15));
  "></div>
</div>
    `;

        context.marker.setContent(div);
      },
    });

    cluster.on("click", function (e: any) {
      clearPolygons();
      const clusterCenter = e.lnglat;
      amap.setZoomAndCenter(amap.getZoom() + 1, clusterCenter);
    });

    return () => {
      clearPolygons();
      cluster.setMap(null);
    };
  }, [amap, AMap, data]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div id="home-map-container" style={{ height: "100%" }}></div>
      <Box sx={{ position: "absolute", top: 0, left: 0, p: 2 }}>
        <Select
          sx={{ width: 160 }}
          placeholder="选择区县"
          onChange={(_, e: any) => {
            if (!amap || !e) return;

            // 清除上一次绘制
            clearPolygons();

            const district = new AMap.DistrictSearch({
              subdistrict: 1, //返回下一级行政区
              showbiz: false, //最后一级返回街道信息
            });

            //注意：需要使用插件同步下发功能才能这样直接使用
            district.setLevel("district"); //行政区级别
            district.setExtensions("all");
            //行政区查询 340000 安庆
            //按照adcode进行查询可以保证数据返回的唯一性
            district.search(e.adcode, function (status: any, data: any) {
              if (status === "complete") {
                var bounds = data.districtList[0].boundaries;
                if (bounds) {
                  for (var i = 0, l = bounds.length; i < l; i++) {
                    var polygon = new AMap.Polygon({
                      map: amap,
                      strokeWeight: 1,
                      strokeColor: "#0091ea",
                      fillColor: "#80d8ff",
                      fillOpacity: 0.2,
                      path: bounds[i],
                    });

                    polygons.current.push(polygon);
                  }

                  amap.setFitView(); //地图自适应
                }
              }
            });

            amap.setCenter(e?.center);
          }}
          defaultValue="340811"
        >
          {districtList.map((item) => (
            <Option key={item.adcode} value={item}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Box>
    </div>
  );
}

function debounce(fn: Function, delay: number) {
  let timer: any = null;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      requestIdle(() => {
        fn(...args);
      });
    }, delay);
  };
}

// 兼容处理 requestIdleCallback
const requestIdle = (cb: () => void) => {
  if ("requestIdleCallback" in globalThis) {
    (globalThis as any).requestIdleCallback(cb);
  } else {
    // fallback: 如果不支持，延迟50ms执行
    setTimeout(cb, 50);
  }
};

// 安庆行政区
const districtList = [
  {
    citycode: "0556",
    adcode: "340828",
    name: "岳西县",
    center: [116.359732, 30.849716],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340881",
    name: "桐城市",
    center: [116.936588, 31.035476],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340803",
    name: "大观区",
    center: [117.013469, 30.553697],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340825",
    name: "太湖县",
    center: [116.30881, 30.454198],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340827",
    name: "望江县",
    center: [116.70641, 30.128404],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340826",
    name: "宿松县",
    center: [116.134485, 30.171663],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340802",
    name: "迎江区",
    center: [117.090878, 30.512768],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340811",
    name: "宜秀区",
    center: [116.987469, 30.613189],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340822",
    name: "怀宁县",
    center: [116.829612, 30.73484],
    level: "district",
    boundaries: [],
  },
  {
    citycode: "0556",
    adcode: "340882",
    name: "潜山市",
    center: [116.581224, 30.631022],
    level: "district",
    boundaries: [],
  },
];
