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
  onChange: (value: Poi) => void;
}

/// 如果是高德地图返回的就是 location_id
/// 如果是本栈数据库返回的就带有 id
export function CommunitySelect({ value, onChange }: CommunitySelectProps) {
  const placeSearchRef = useRef<any>(null);
  const [keyword, seKeyword] = useState<string>("");
  const { data } = useQuery({
    queryKey: ["initMap"],
    queryFn: getCommunityList,
  });

  const { data: poiList, isRefetching } = useQuery({
    queryKey: [keyword],
    queryFn: () => {
      return new Promise<Poi[]>((resolve) => {
        let isHas = cache.values().some((item) => item.name.includes(keyword));

        if (isHas) {
          resolve(Array.from(cache.values()));
          return;
        }

        const placeSearch = placeSearchRef.current;
        if (placeSearch) {
          placeSearch.search(keyword, function (_: any, result: SearchData) {
            // 搜索成功时，result即是对应的匹配数据
            if (result.info === "OK") {
              const pois = result.poiList?.pois;
              if (pois && pois.length) {
                resolve(
                  pois.map(
                    ({ id, ...item }) => ({ ...item, location_id: id } as Poi)
                  )
                );
              }
            }
          });
        }
      });
    },
    enabled: keyword !== "",
  });

  useMemo(() => {
    const id = value?.id;
    if (id && !cache.has(id)) {
      cache.set(id, value);
    }
  }, [value]);

  useMemo(() => {
    if (data) {
      for (const poi of data) {
        if (poi.location_id) {
          // 待id 表示更新
          cache.set(poi.location_id, {
            id: poi.location_id!,
            location_id: poi.location_id!,
            name: poi.name!,
            type: poi.community_type!,
            location: {
              pos: [poi.location_0, poi.location_1] as [number, number],
            },
            address: poi.address!,
          });
        }
      }
    }
  }, [data]);

  useEffect(() => {
    (global as any).initMap = () => {
      AMap.plugin("AMap.PlaceSearch", function () {
        var autoOptions = {
          city: "安庆",
          type: "住宅",
          pageSize: 20,
        };
        placeSearchRef.current = new (AMap as any).PlaceSearch(autoOptions);
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
        options={poiList ?? Array.from(cache.values())}
        placeholder="请输入"
        loading={isRefetching}
        value={value}
        isOptionEqualToValue={(option, value) => {
          return option.id === value.id;
        }}
        onInputChange={(_, keyword) => {
          seKeyword(keyword);
        }}
        onChange={(_, value) => {
          onChange(value!);
        }}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          return (
            <AutocompleteOption {...props} key={option.location_id}>
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
  poiList: PoiList;
}

export interface PoiList {
  pois: Poi[];
  count: number;
  pageIndex: number;
  pageSize: number;
}

export interface Poi {
  id?: string;
  location_id: string;
  name: string;
  type: string;
  location: {
    pos: number[];
  };
  address: string;
  tel?: string;
  distance?: any;
  shopinfo?: string;
}
