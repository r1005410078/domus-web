"use client";

import Script from "next/script";
import { useEffect } from "react";
import "@amap/amap-jsapi-types";
export function MapPage() {
  useEffect(() => {
    (global as any).initMap = () => {
      // 可选：地图初始化逻辑放这里
      const map = new window.AMap.Map("container", {
        rotateEnable: true,
        pitchEnable: true,
        zoom: 17,
        pitch: 50,
        rotation: -15,
        viewMode: "3D", //开启3D视图,默认为关闭
        zooms: [2, 20],
        center: [116.333926, 39.997245],
      });
    };
  }, []);

  return (
    <>
      <Script
        src="https://webapi.amap.com/maps?v=2.0&key=7a4a5bf23ff36a44e4ffb04bbbf77e01&callback=initMap"
        strategy="afterInteractive"
      />
      <div id="container" style={{ width: "100%", height: "100%" }} />
    </>
  );
}
