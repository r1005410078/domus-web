import { useColorScheme } from "@mui/joy";
import { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

(global as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export interface AMapOptions {
  zoom?: number;
  center?: [number, number];
}

export function useAMap(mapElementId?: string, defaultOptions?: AMapOptions) {
  const { mode } = useColorScheme();
  const [amap, setMap] = useState<any>();
  const [AMap, setAMap] = useState<any>();

  const style = mode === "dark" ? "amap://styles/dark" : "amap://styles/normal";

  useEffect(() => {
    AMapLoader.load({
      key: "beb2c304f924eedf108a4632603711b4", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        "AMap.Scale",
        "AMap.PlaceSearch",
        "AMap.MarkerCluster",
        "AMap.ToolBar",
        "AMap.ControlBar",
        "AMap.DistrictSearch",
        "AMap.AutoComplete",
      ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        if (mapElementId) {
          const amap = new AMap.Map(mapElementId, {
            // 设置地图容器id
            zoom: defaultOptions?.zoom || 10, // 初始化地图级别
            center: defaultOptions?.center || [117.060496, 30.507077],
          });
          setMap(amap);
        }

        setAMap(AMap);
      })
      .catch((e) => {
        console.error("Amap error", e);
      });

    return () => {
      amap?.destroy();
    };
  }, [mapElementId]);

  useEffect(() => {
    if (amap) {
      amap.setMapStyle(style);
    }
  }, [style, amap]);

  return { amap, AMap };
}

export function useAMapAutoComplete() {
  const { AMap } = useAMap();
  const [autoComplete, setAutoComplete] = useState<any>();

  useEffect(() => {
    if (AMap) {
      const autoOptions = {
        city: "安庆",
        type: "12",
        pageSize: 20,
        citylimit: true,
      };

      setAutoComplete(new AMap.AutoComplete(autoOptions));
    }
  }, [AMap]);

  return autoComplete;
}

export function useBindAMapToolBar(amap: any, AMap: any) {
  useEffect(() => {
    if (!amap || !AMap) return;

    const scale = new AMap.Scale({
      visible: true,
    });

    const toolBar = new AMap.ToolBar({
      visible: true,
      position: {
        top: "110px",
        right: "40px",
      },
    });

    const controlBar = new AMap.ControlBar({
      visible: true,
      position: {
        top: "10px",
        right: "10px",
      },
    });

    amap.addControl(scale);
    amap.addControl(toolBar);
    amap.addControl(controlBar);
  }, [AMap, amap]);
}
