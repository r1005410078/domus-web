import {
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import "@amap/amap-jsapi-types";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useQuery } from "@tanstack/react-query";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
(window as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

// 检索缓存
const cache = new Map<string, Poi>();

export function CommunitySelect() {
  const [placeSearch, setPlaceSearch] = useState<any>(null);
  const [keyword, seKeyword] = useState<string>("");

  const { data: poiList, isRefetching } = useQuery({
    queryKey: [keyword],
    queryFn: () => {
      return new Promise<Poi[]>((resolve) => {
        let isHas = cache.values().some((item) => item.name.includes(keyword));

        if (isHas) {
          resolve(cache.values().toArray());
        }
        placeSearch.search(keyword, function (status: any, result: SearchData) {
          // 搜索成功时，result即是对应的匹配数据
          if (result.info === "OK") {
            resolve(result.poiList?.pois);
          }
        });
      });
    },
    enabled: keyword !== "",
  });

  useEffect(() => {
    (window as any).initMap = () => {
      AMap.plugin("AMap.PlaceSearch", function () {
        var autoOptions = {
          city: "安庆",
          type: "住宅",
          pageSize: 20,
        };
        var placeSearch = new (AMap as any).PlaceSearch(autoOptions);
        setPlaceSearch(placeSearch);
      });
    };
  }, []);

  useEffect(() => {
    for (const poi of poiList ?? []) {
      cache.set(poi.id, poi);
    }
  }, [poiList]);

  return (
    <>
      <script type="text/javascript"></script>
      <Script
        src="https://webapi.amap.com/maps?v=2.0&key=beb2c304f924eedf108a4632603711b4&callback=initMap"
        strategy="afterInteractive"
      />
      <Autocomplete
        options={poiList ?? cache.values().toArray()}
        placeholder="请输入"
        loading={isRefetching}
        onInputChange={(event, keyword) => {
          seKeyword(keyword);
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
  poiList: PoiList;
}

export interface PoiList {
  pois: Poi[];
  count: number;
  pageIndex: number;
  pageSize: number;
}

export interface Poi {
  id: string;
  name: string;
  type: string;
  location: number[];
  address: string;
  tel: string;
  distance: any;
  shopinfo: string;
}
