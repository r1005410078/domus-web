"use client";

import Header from "@/components/Header";
import House from "@/components/House";
import Layout from "@/components/layouts/Layout";
import { useGetHouseDetail } from "@/hooks/useHouse";
import { CircularProgress, Stack } from "@mui/joy";
import { use } from "react";
import { useSearchParams } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = use(params);
  const { data, isLoading } = useGetHouseDetail(houseId);
  const searchParams = useSearchParams();
  const transactionType = searchParams.get("transactionType");

  return (
    <Layout.Root>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        {isLoading ? (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <House.Detail detail={data!} transactionType={transactionType!} />
        )}
      </Layout.Main>
    </Layout.Root>
  );
}
