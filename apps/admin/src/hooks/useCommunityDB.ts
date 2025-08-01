"use client";

import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/db-collections";
import { getCommunityList } from "@/services/house";
import { communitySchema } from "@/schema/house";
import { queryClient } from "@/lib/QueryProvider";
import { CollectionChache } from "@/utils/CollectionChache";
import { Community } from "@/models/house";
import "@/utils/crypto-polyfill";

const PAGE_SIZE = 100;
const communityChache = new CollectionChache({
  chacheKey: "COMMUNITY_CHACHE_DATA",
  getData: (page, updated_at) =>
    getCommunityList({
      updated_at,
      page,
      page_size: PAGE_SIZE,
    }).then((res) => res),
  pageSize: PAGE_SIZE,
});

const communityCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["communitysCollection"],
    queryClient,
    queryFn: async () => {
      return communityChache.syncData() as Promise<Community[]>;
    },
    getKey: (item) => item.id,
    schema: communitySchema,
    onInsert: async ({ transaction }) => {},
  })
);

export function useCommunityDB() {
  const { data: communitys } = useLiveQuery((q) =>
    q
      .from({ house: communityCollection })
      .orderBy((h) => h.house.updated_at, "desc")
  );

  return { communitys };
}
