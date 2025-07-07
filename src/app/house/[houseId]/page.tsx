"use client";
import { use } from "react";
import House from "@/components/House";
import Header from "@/components/Header";
import Layout from "@/components/layouts/Layout";
import { HouseForm } from "@/models/house";
import { useGetHouseDetail } from "@/hooks/useHouse";
import { CircularProgress, Skeleton, Stack } from "@mui/joy";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = use(params);

  const { data: defaultValues, isLoading } = useGetHouseDetail(houseId);

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
          <House.Form defaultValues={defaultValues} />
        )}
      </Layout.Main>
    </Layout.Root>
  );
}
