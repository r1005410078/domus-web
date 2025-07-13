"use client";

import React from "react";
import LayoutFrame from "@/components/LayoutFrame";

export default function Page() {
  return (
    <LayoutFrame tabBar={{ items: [], value: "", onChange: () => {} }}>
      用户管理
    </LayoutFrame>
  );
}
