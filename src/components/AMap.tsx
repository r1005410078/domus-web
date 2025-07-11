"use client";

import Script from "next/script";
import { useEffect } from "react";
import "@amap/amap-jsapi-types";

interface CommunityWithHouseCount {
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
}

export function MapPage({ data }: MapPageProps) {
  useEffect(() => {
    (global as any).initMap = () => {
      const AMap = (window as any).AMap as any;
      // 可选：地图初始化逻辑放这里
      const map = new AMap.Map("container", {
        zoom: 10,
        center: [117.060496, 30.507077],
      });

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

      map.addControl(scale);
      map.addControl(toolBar);
      map.addControl(controlBar);

      var points = data.map((item) => {
        return {
          lnglat: [item.lng, item.lat],
          item,
        };
      });

      var _renderMarker = function (context: any) {
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

      var cluster = new AMap.MarkerCluster(map, points, {
        gridSize: 10, // 设置网格像素大小
        // renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
        renderMarker: _renderMarker, // 自定义非聚合点样式
        renderClusterMarker: function (context: any) {
          const count = context.clusterData.reduce(
            (a: number, b: any) => a + b.item.house_count,
            0
          );
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
        const clusterCenter = e.lnglat;
        map.setZoomAndCenter(map.getZoom() + 1, clusterCenter);
      });

      map.setFitView();
    };
  }, []);

  return (
    <>
      <Script
        src="https://webapi.amap.com/maps?v=2.0&key=7a4a5bf23ff36a44e4ffb04bbbf77e01&callback=initMap&plugin=AMap.MarkerCluster,AMap.Scale,AMap.ToolBar,AMap.ControlBar"
        strategy="afterInteractive"
      />
      <div id="container" style={{ width: "100%", height: "100%" }} />
    </>
  );
}
