"use client";

import {
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import "@amap/amap-jsapi-types";
import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useQuery } from "@tanstack/react-query";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { getCommunityList } from "@/services/house";

(global as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

// 检索缓存
const cache = new Map<string, Poi>();

interface CommunitySelectProps {
  value?: Poi;
  onChange: (value: Poi | null) => void;
}

/// 如果是高德地图返回的就是 location_id
/// 如果是本栈数据库返回的就带有 id
export function CommunitySelect({ value, onChange }: CommunitySelectProps) {
  const placeSearchRef = useRef<any>(null);
  const [keyword, seKeyword] = useState<string>("");
  const [options, setOptions] = useState<Poi[]>([]);
  const { data } = useQuery({
    queryKey: ["initMap"],
    queryFn: getCommunityList,
  });

  useMemo(() => {
    if (data) {
      for (const poi of data) {
        if (poi.location_id) {
          // 待id 表示更新
          cache.set(poi.location_id, {
            id: poi.location_id!,
            location_id: poi.location_id!,
            name: poi.name!,
            typecode: poi.typecode!,
            district: poi.district!,
            adcode: poi.adcode!,
            city: [poi.city ?? "安庆"],
            location: {
              lat: poi.lat,
              lng: poi.lng,
            },
            address: poi.address!,
          });
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (keyword) {
      let isHas = cache.values().some((item) => item.name.includes(keyword));
      if (!isHas) {
        const placeSearch = placeSearchRef.current;
        if (placeSearch) {
          placeSearch.search(keyword, function (_: any, result: SearchData) {
            // 搜索成功时，result即是对应的匹配数据
            if (result.info === "OK") {
              const pois = result.tips;
              if (pois && pois.length) {
                const poiList = pois.map(
                  ({ id, ...item }) =>
                    ({ ...item, location_id: id, city: ["安庆"] } as Poi)
                );

                for (let poi of poiList) {
                  if (!cache.has(poi.location_id)) {
                    cache.set(poi.location_id, poi);
                  }
                }
              }
              setOptions(Array.from(cache.values()));
            }
          });
        }
      }
    }
  }, [keyword]);

  useEffect(() => {
    const location_id = value?.location_id;
    if (location_id && !cache.has(location_id)) {
      cache.set(location_id, value);
    }
    setOptions(Array.from(cache.values()));
  }, [value]);

  useEffect(() => {
    (global as any).initMap = () => {
      AMap.plugin("AMap.AutoComplete", function () {
        var autoOptions = {
          city: "安庆",
          type: "12",
          pageSize: 20,
          citylimit: true,
        };
        placeSearchRef.current = new (AMap as any).AutoComplete(autoOptions);
      });
    };
  }, []);

  return (
    <>
      <script type="text/javascript"></script>
      <Script
        src="https://webapi.amap.com/maps?v=2.0&key=beb2c304f924eedf108a4632603711b4&callback=initMap"
        strategy="afterInteractive"
      />
      <Autocomplete
        options={options}
        placeholder="请输入"
        value={value}
        isOptionEqualToValue={(option, value) => {
          return option?.location_id === value?.location_id;
        }}
        onInputChange={(_, keyword) => {
          seKeyword(keyword);
        }}
        onChange={(_, value) => {
          onChange(value);
        }}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          return (
            <AutocompleteOption {...props}>
              <ListItemDecorator>
                <MapsHomeWorkIcon color="primary" />
              </ListItemDecorator>
              <ListItemContent sx={{ fontSize: "sm" }}>
                {option.name}
                <Typography level="body-xs">{option.address}</Typography>
              </ListItemContent>
            </AutocompleteOption>
          );
        }}
      />
    </>
  );
}

export interface SearchData {
  info: string;
  count: number;
  tips: Poi[];
}

export interface Poi {
  id?: string; // POI（地点）的唯一标识 ID（比如可以用于查询详情）
  name: string; // 地点名称（如“朝阳大悦城”）
  district: string; // 所属行政区（如“朝阳区”）
  adcode: string; // 所属行政区划代码（如“110105”，代表朝阳区）
  location: {
    // 坐标和位置信息（部分字段是内部属性）
    KL?: number; // 内部属性（可能是高德用于计算或缓存的值，可忽略）
    className?: string; // 类型标识（如 "AMap.LngLat"）
    kT?: string; // 内部属性，通常表示经纬度字符串（"lng,lat" 格式）
    lat: string; // 纬度（如 "39.9235"）
    lng: string; // 经度（如 "116.428"）
    pos?: [number, number]; // 坐标数组：[经度, 纬度]，用于直接在地图上定位
  };
  address: string; // 详细地址（如“北京市朝阳区朝阳北路101号”）
  typecode: string; // POI 类型编码（如 "060100" 表示“汽车服务”）
  city?: string[]; // 所属城市（可能为空数组或 ["北京"]，注意是数组）
  location_id: string; // 衍生字段，可能是 location 对象的标识（不一定总返回）
}
