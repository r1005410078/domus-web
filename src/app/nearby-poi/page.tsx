"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import AMapLoader from "@amap/amap-jsapi-loader";
const snapPoints = [0.5, 1];

(globalThis as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export default function Page() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  let mapRef = useRef<any>(null);

  useEffect(() => {
    AMapLoader.load({
      key: "beb2c304f924eedf108a4632603711b4", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale", "AMap.PlaceSearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        mapRef.current = new AMap.Map("container", {
          // 设置地图容器id
          // viewMode: "3D", // 是否为3D地图模式
          // zoom: 11, // 初始化地图级别
          // center: [116.397428, 39.90923], // 初始化地图中心点位置
          resizeEnable: true,
        });

        AMap.plugin(["AMap.PlaceSearch"], function () {
          //构造地点查询类
          var placeSearch = new AMap.PlaceSearch({
            type: "科教文化服务|交通设施服务|餐饮服务", // 兴趣点类别  交通设施服务 科教文化服务 政府机构及社会团体 商务住宅 风景名胜 医疗保健服务 餐饮服务
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "010", // 兴趣点城市
            citylimit: true, //是否强制限制在设置的城市内搜索
            map: mapRef.current, // 展现结果的地图实例
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          });

          console.log("placeSearch", placeSearch);

          var cpoint = [116.405467, 39.907761]; //中心点坐标
          placeSearch.searchNearBy(
            "",
            cpoint,
            200,
            function (status, result) {}
          );
        });
      })
      .catch((e) => {
        console.log("111", e);
      });

    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      snapToSequentialPoint
      open
      modal={false}
    >
      <div id="container" className="w-[100wh] h-[100vh]"></div>
      <Drawer.Overlay className="fixed inset-0 bg-black/40"></Drawer.Overlay>
      <Drawer.Portal>
        <Drawer.Content
          data-testid="content"
          className="fixed flex z-[9999] flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
        >
          <div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
            <Drawer.Handle />
            <div id="panel"></div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// import { useEffect, useRef, useState } from "react";
// import AMapLoader from "@amap/amap-jsapi-loader";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Button } from "@mui/joy";

// (globalThis as any)._AMapSecurityConfig = {
//   securityJsCode: "643afd6680cc38718fd6892c62f9045c",
// };
