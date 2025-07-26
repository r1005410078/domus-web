"use client";

import React from "react";
import dynamic from "next/dynamic";

const NoSSRUserPage = dynamic(() => import("@/components/UserPage"), {
  ssr: false,
});

export default function Page() {
  return <NoSSRUserPage />;
}
