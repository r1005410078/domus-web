"use client";

import { memo, useEffect, useRef, useState } from "react";
import "@amap/amap-jsapi-types";
import {
  Select,
  Option,
  Box,
  Stack,
  Typography,
  IconButton,
  SelectStaticProps,
} from "@mui/joy";
import { useAMap, useBindAMapToolBar } from "@/hooks/useAMap";
import { create } from "zustand";
import MyLocationTwoToneIcon from "@mui/icons-material/MyLocationTwoTone";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import CloseRounded from "@mui/icons-material/CloseRounded";

// https://codesandbox.io/p/sandbox/aggregate-by-index-forked-4l76vr?file=%2Findex.html%3A22%2C93-22%2C110

const clusterIndexSet = {
  city: {
    minZoom: 2,
    maxZoom: 10,
  },
  district: {
    minZoom: 10,
    maxZoom: 12,
  },
  area: {
    minZoom: 12,
    maxZoom: 15,
  },
  community: {
    minZoom: 15,
    maxZoom: 22,
  },
};

export interface Points {
  area: string;
  building: string;
  city: string;
  community: string;
  district: string;
  lnglat: {
    lng: number;
    lat: number;
  };
  weight?: number;
}

export interface MapPageProps {
  points: Points[];
  onMapBoundsChange?: (bounds: AmapBounds) => void;
}

export interface AmapBounds {
  north_east: { lng: number; lat: number };
  south_west: { lng: number; lat: number };
}

export interface IHomeMap {
  amap: any;
  setAMap: (amap: any) => void;
  setCenter: (center: any) => void;
}

export const HomeMap = create<IHomeMap>((set, get) => ({
  amap: null,
  setAMap: (amap: any) => set({ amap }),
  setCenter: (center: any) => {
    get().amap.setZoom(17);
    get().amap.setCenter(center);
  },
}));

function AMapComponent({ points, onMapBoundsChange }: MapPageProps) {
  const [area, setArea] = useState<any>();
  const action: SelectStaticProps["action"] = useRef(null);
  const { amap, AMap } = useAMap("home-map-container");
  const [streetList, setStreetList] = useState<IDistrict[]>([]);
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

    let callback = logMapBounds;
    //绑定地图移动与缩放事件
    amap.on("moveend", callback);

    HomeMap.getState().setAMap(amap);
    return () => {
      amap.off("moveend", callback);
      HomeMap.getState().setAMap(null);
    };
  }, [amap]);

  useEffect(() => {
    if (!amap || !AMap) return;
    var cluster = new AMap.IndexCluster(amap, points, {
      renderClusterMarker: (context: any) => {
        _renderClusterMarker(amap, AMap, context, points);
      },
      clusterIndexSet: clusterIndexSet,
    });

    return () => {
      cluster.setMap(null);
    };
  }, [amap, AMap, points]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div id="home-map-container" style={{ height: "100%" }}></div>
      <style jsx global>
        {`
          html,
          body,
          #container {
            height: 100%;
            width: 100%;
          }
          .amap-cluster {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px !important;
          }
          .showName {
            font-size: 14px;
          }
          .showCount,
          .showName {
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 80%;
          }
        `}
      </style>
      <Stack
        direction="row"
        gap={1}
        sx={{ position: "absolute", top: 0, left: 0, p: 2, height: 50 }}
      >
        <Select
          action={action}
          sx={{ width: 160 }}
          placeholder="选择区县"
          startDecorator={<MyLocationTwoToneIcon />}
          value={area || undefined}
          {...(area && {
            // display the button and remove select indicator
            // when user has selected a value
            endDecorator: (
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onMouseDown={(event) => {
                  // don't open the popup when clicking on this button
                  event.stopPropagation();
                }}
                onClick={() => {
                  setArea(null);
                  setStreetList([]);
                  clearPolygons();
                  action.current?.focusVisible();
                }}
              >
                <CloseRounded />
              </IconButton>
            ),
            indicator: null,
          })}
          onChange={(_, e: any) => {
            setArea(e);
            if (!amap || !e) return;
            setStreetList([]);
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

                  //地图自适应
                  amap.setFitView(polygons.current);
                }

                setStreetList(data.districtList[0].districtList);
              }
            });

            amap.setCenter(e?.center);
          }}
          defaultValue="340811"
        >
          {districtList.map((item) => (
            <Option key={item.adcode} value={item}>
              <Typography
                startDecorator={<LocationOnTwoToneIcon />}
                sx={{ mb: 2 }}
              >
                {item.name}
              </Typography>
            </Option>
          ))}
        </Select>

        <Select
          sx={{ width: 160 }}
          placeholder="选择街道"
          startDecorator={<MyLocationTwoToneIcon />}
          onChange={(_, e: any) => {
            if (!amap || !e) return;
            amap.setZoom(12);
            amap.setCenter(e?.center);
          }}
        >
          {streetList.map((item) => (
            <Option key={item.adcode} value={item}>
              <Typography
                startDecorator={<LocationOnTwoToneIcon />}
                sx={{ mb: 2 }}
              >
                {item.name}
              </Typography>
            </Option>
          ))}
        </Select>
      </Stack>
    </div>
  );
}

export default memo(AMapComponent);

function getStyle(context: any, points: Points[]) {
  let clusterData = context.clusterData; // Data included in the aggregation
  let index = context.index; // Conditions for aggregation

  let color = ["8,60,156", "66,130,198", "107,174,214", "78,200,211"];
  let indexs = ["city", "district", "area", "community"]; //
  let i = indexs.indexOf(index["mainKey"]);
  let text = clusterData[0][index["mainKey"]];
  // let size = Math.round(30 + Math.pow(count / points.length, 1 / 5) * 70);
  let size = 80;

  if (i <= 3) {
    let extra = '<span class="showCount">' + context.count + "套</span>";
    text = '<span class="showName">' + text + "</span>";
    text += extra;
  } else {
    size = 12 * text.length + 20;
  }

  let style = {
    bgColor: "rgba(" + color[i] + ",.8)",
    borderColor: "rgba(" + color[i] + ",1)",
    text: text,
    size: size,
    index: i,
    color: "#ffffff",
    textAlign: "center",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.8)",
    count: context.count,
    name: clusterData[0][index["mainKey"]],
  };

  return style;
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

function getPosition(AMap: any, context: any, points: Points[]) {
  var key = context.index.mainKey;
  var dataItem = context.clusterData && context.clusterData[0];
  var districtName = dataItem[key];
  // @ts-ignore
  if (!district[districtName]) {
    return null;
  }
  // @ts-ignore
  var center = district[districtName].center.split(",");
  var centerLnglat = new AMap.LngLat(center[0], center[1]);
  return centerLnglat;
}

// Custom cluster point style
function _renderClusterMarker(
  map: any,
  AMap: any,
  context: any,
  points: Points[],
  onClick?: () => {}
) {
  var styleObj = getStyle(context, points);
  // Custom Point Marker Style
  var div = document.createElement("div");
  div.className = "amap-cluster";
  div.style.backgroundColor = styleObj.bgColor;
  div.style.width = styleObj.size + "px";
  if (styleObj.index <= 2) {
    div.style.height = styleObj.size + "px";
    // Custom Click Event
    context.marker.on("click", function (e: any) {
      var curZoom = map.getZoom();
      if (curZoom < 20) {
        curZoom += 1;
      }

      onClick?.();
      map.setZoomAndCenter(curZoom, e.lnglat);
    });
  }
  div.style.border = "solid 1px " + styleObj.borderColor;
  div.style.borderRadius = styleObj.size + "px";
  div.innerHTML = styleObj.text;
  div.style.color = styleObj.color;
  div.style.textAlign = styleObj.textAlign;
  div.style.boxShadow = styleObj.boxShadow;

  if (styleObj.index >= 2) {
    div.style = "";
    div.innerHTML = `
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
      🏡 ${styleObj.name} <span style="margin-left: 6px; color: #D84315;">${styleObj.count} 套</span>
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
  }

  context.marker.setContent(div);
  // Custom Cluster Marker Display Position
  var position = getPosition(AMap, context, points);
  if (position) {
    context.marker.setPosition(position);
  }
  context.marker.setAnchor("center");
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

export interface IDistrict {
  citycode: string;
  adcode: string;
  name: string;
  center: [number, number];
  level: string;
  boundaries: [];
}

// 安庆行政区
const districtList = [
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

const district = districtList.reduce(
  (pre, cur) => {
    // @ts-ignore
    pre[cur.name] = {
      adcode: cur.adcode,
      center: cur.center.join(","),
    };
    return pre;
  },
  {} as { adcode: string; center: string }
);
