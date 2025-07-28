"use client";

import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/db-collections";
import { deleteHouse, getHouseList } from "@/services/house";
import { HouseData, houseDataSchema } from "@/schema/house";
import { queryClient } from "@/libs/QueryProvider";
import { CollectionChache } from "@/utils/CollectionChache";
import { useQueryClient } from "@tanstack/react-query";
import "@/utils/crypto-polyfill";

// 同步房源数据
const PAGE_SIZE = 100;
const houseChache = new CollectionChache({
  chacheKey: "HOUSE_CHACHE_DATA",
  getData: (page, updated_at) =>
    getHouseList({
      updated_at,
      page,
      page_size: PAGE_SIZE,
      not_exclude_deleted: true,
    }).then((res) => res.list),
  pageSize: PAGE_SIZE,
});

const houseCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["houseCollection"],
    queryClient,
    queryFn: async () => {
      const data = await houseChache.syncData();
      return new Promise<HouseData[]>((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 300);
      });
    },
    getKey: (item) => item.id,
    schema: houseDataSchema,
    onInsert: async ({ transaction }) => Promise.resolve(),
    onUpdate: async ({ transaction }) => Promise.resolve(),
    onDelete: async (item) => {
      const house_id = item.transaction.mutations[0].changes.id;
      await deleteHouse(house_id);
    },
  })
);

export function useHouseDB() {
  const queryClient = useQueryClient();
  const { data: houseDataSource } = useLiveQuery((q) =>
    q
      .from({ house: houseCollection })
      .orderBy((h) => h.house.updated_at, "desc")
  );

  return {
    houseDataSource,
    refreshHouse: () =>
      queryClient.refetchQueries({ queryKey: ["houseCollection"] }),
    // 强制刷新
    forceRefreshHouse: () => {
      houseChache.clear();
      queryClient.refetchQueries({ queryKey: ["houseCollection"] });
    },
    houseCollection,
  };
}
