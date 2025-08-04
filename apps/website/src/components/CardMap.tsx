"use client";

import * as React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { AspectRatio, Button, IconButton, useColorScheme } from "@mui/joy";
import { Community } from "@/models/house";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import AMapLoader from "@amap/amap-jsapi-loader";
import { isMobile } from "@repo/lib/utils";
import { HomeMap } from "./AMap";

(global as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export interface CardMapProps {
  community: Community;
}

export default function CardMap({ community }: CardMapProps) {
  React.useEffect(() => {
    let amap: any = null;
    AMapLoader.load({
      key: "beb2c304f924eedf108a4632603711b4", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    })
      .then((AMap) => {
        amap = new AMap.Map("CardMap", {
          // 设置地图容器id
          zoom: 16, // 初始化地图级别
          center: [community.lng, community.lat],
        });

        const marker = new AMap.Marker({
          // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          position: [community.lng, community.lat],
        });

        marker.setMap(amap);
      })
      .catch((e) => {
        console.error("Amap error", e);
      });

    return () => {
      amap?.destroy();
    };
  }, [community]);

  return (
    <Card variant="plain" sx={{ p: 0 }}>
      <div>
        <Typography level="title-lg">{community.name}</Typography>
        <Typography level="body-sm">{community.address}</Typography>
        <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          color="neutral"
          size="lg"
          sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
          onClick={() => {
            if (!isMobile) {
              HomeMap.getState().setCenter([community?.lng, community?.lat]);
            }
          }}
        >
          <PinDropOutlinedIcon />
        </IconButton>
      </div>
      <Card sx={{ p: 0 }}>
        <AspectRatio>
          <div
            id="CardMap"
            style={{
              width: "100%",
              height: 280,
            }}
          ></div>
        </AspectRatio>
      </Card>
      <CardContent orientation="horizontal" sx={{ display: "flex" }}>
        <Button
          variant="soft"
          size="lg"
          color="danger"
          aria-label="Explore Bahamas Islands"
          onClick={() => {
            location.href =
              "/nearby-poi?lat=" + community.lat + "&lng=" + community.lng;
          }}
          sx={{
            flex: 1,
            fontWeight: 500,
            letterSpacing: "1px",
            borderRadius: 16,
          }}
        >
          更多周边信息
        </Button>
      </CardContent>
    </Card>
  );
}
