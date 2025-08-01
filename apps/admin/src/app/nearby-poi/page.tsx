"use client";

import NearbyPoi from "@/components/NearbyPoi";
import dynamic from "next/dynamic";

const NoSSRNearbyPoi = dynamic(() => import("@/components/NearbyPoi"), {
  ssr: false,
});

export default function Page() {
  return <NoSSRNearbyPoi />;
}
