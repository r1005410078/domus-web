"use client";

import * as React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { AspectRatio, Button, IconButton, useColorScheme } from "@mui/joy";
import { Community } from "@/models/house";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
interface CardMapProps {
  community: Community;
}

(globalThis as any)._AMapSecurityConfig = {
  securityJsCode: "643afd6680cc38718fd6892c62f9045c",
};

export default function CardMap({ community }: CardMapProps) {
  const AMapRef = React.useRef<any>(null);
  const { mode } = useColorScheme();

  const initMap = () => {
    const style =
      mode === "dark" ? "amap://styles/darkblue" : "amap://styles/normal";

    const AMap = (window as any).AMap as any;

    AMapRef.current = AMap;
    console.log("community", community.lng, community.lat);
    // 可选：地图初始化逻辑放这里
    const map = new AMap.Map("CardMap", {
      zoom: 16,
      resizeEnable: true,
      center: [community.lng, community.lat],
      mapStyle: style,
    });

    var marker = new AMap.Marker({
      // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: [community.lng, community.lat],
    });
    marker.setMap(map);
  };

  React.useEffect(() => {
    const existing = document.getElementById("amap-script");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src =
      "https://webapi.amap.com/maps?v=2.0&key=beb2c304f924eedf108a4632603711b4";
    script.id = "amap-script";
    script.async = true;
    script.onload = initMap;

    document.body.appendChild(script);

    return () => {
      document.getElementById("amap-script")?.remove();
    };
  }, []);

  return (
    <Card>
      <div>
        <Typography level="title-lg">{community.name}</Typography>
        <Typography level="body-sm">{community.address}</Typography>
        <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          color="neutral"
          size="lg"
          sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
        >
          <PinDropOutlinedIcon />
        </IconButton>
      </div>
      <AspectRatio>
        <div
          id="CardMap"
          style={{
            width: "100%",
            height: 280,
          }}
        ></div>
      </AspectRatio>
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
