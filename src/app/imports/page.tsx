"use client";

import { Button, Sheet } from "@mui/joy";
import Script from "next/script";
import { useEffect, useRef } from "react";
import communityData from "./data/community.json";

(global as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export default function Page() {
  const placeSearchRef = useRef<any>(null);

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
      <Sheet
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Button onClick={importCommunity}>导入</Button>
      </Sheet>
    </>
  );

  async function importCommunity() {
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
      console.log("result", res.name);
    }

    console.log(not);
    console.log(data);
  }
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
