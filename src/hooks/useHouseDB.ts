"use client";

import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/query-core";
import { queryCollectionOptions } from "@tanstack/db-collections";
import { use, useEffect, useMemo, useRef } from "react";
import { getHouseList } from "@/services/house";
import "@/utils/crypto-polyfill";
import { houseDataSchema } from "@/schema/house";
import { queryClient } from "@/libs/QueryProvider";
import { CollectionChache } from "@/utils/CollectionChache";

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
      return houseChache.syncData();
    },
    getKey: (item) => item.id,
    schema: houseDataSchema,
    onInsert: async ({ transaction }) => {}, // any standard schema
  })
);

export function useHouseDB() {
  const { data: houseDataSource } = useLiveQuery((q) =>
    q
      .from({ house: houseCollection })
      .orderBy((h) => h.house.updated_at, "desc")
  );

  return { houseDataSource };
}
