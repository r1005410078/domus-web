"use client";

import {
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import "@amap/amap-jsapi-types";
import { useEffect, useState } from "react";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { useAMapAutoComplete } from "@/hooks/useAMap";
import { useCommunityDB } from "@/hooks/useCommunityDB";
import { useDebouncedCallback } from "use-debounce";

// 检索缓存
const cache = new Map<string, Poi>();

interface CommunitySelectProps {
  value?: Poi | null;
  onChange: (value: Poi | null) => void;
}

export default function CommunitySelect({
  value,
  onChange,
}: CommunitySelectProps) {
  const [options, setOptions] = useState<Poi[]>([]);
  const { communitys: data } = useCommunityDB();
  const autocomplete = useAMapAutoComplete();
  const lastUpdateTime = data?.[data.length - 1]?.updated_at;

  useEffect(() => {
    if (data) {
      for (const poi of data) {
        if (poi.id) {
          cache.set(poi.id, {
            id: poi.id!,
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
      setOptions(Array.from(cache.values()));
    }
  }, [lastUpdateTime]);

  useEffect(() => {
    const id = value?.id;
    if (id && !cache.has(id)) {
      cache.set(id, value);
    }
    setOptions(Array.from(cache.values()));
  }, [value]);

  const onInputChangeHandler = useDebouncedCallback(onInputChange, 300);

  return (
    <>
      <Autocomplete
        options={options}
        placeholder="请输入"
        value={value}
        isOptionEqualToValue={(option, value) => {
          return option?.id === value?.id;
        }}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, keyword) => onInputChangeHandler(keyword)}
        onChange={(_, value) => {
          onChange(value);
        }}
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

  function onInputChange(keyword: string) {
    console.log("keyword", keyword);
    let isHas = cache.values().some((item) => item.name.includes(keyword));
    if (!isHas) {
      if (autocomplete) {
        autocomplete.search(keyword, function (_: any, result: SearchData) {
          // 搜索成功时，result即是对应的匹配数据
          if (result.info === "OK") {
            const pois = result.tips;
            if (pois && pois.length) {
              const poiList = pois.map(
                ({ ...item }) => ({ ...item, city: ["安庆"] } as Poi)
              );

              for (let poi of poiList) {
                if (!cache.has(poi.id)) {
                  cache.set(poi.id, poi);
                }
              }
            }
            setOptions(Array.from(cache.values()));
          }
        });
      }
    }
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
