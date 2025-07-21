"use client";

import {
  createCollection,
  useLiveQuery,
  QueryBuilder,
} from "@tanstack/react-db";
import { QueryClient } from "@tanstack/query-core";
import {
  localStorageCollectionOptions,
  queryCollectionOptions,
} from "@tanstack/db-collections";
import { useEffect, useRef } from "react";
import { getHouseList } from "@/services/house";
import "@/utils/crypto-polyfill";
import { houseDataSchema } from "@/schema/house";
import z from "zod";
import { HouseData } from "@/models/house";

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["todoItems"],
    queryClient,
    queryFn: async () => {
      console.log("todoCollection", "我被刷新了");

      return [
        { id: 1, title: "Todo 1", completed: false },
        { id: 2, title: "Todo 2", completed: false },
        { id: 3, title: "Todo 3", completed: false },
      ];
    },
    getKey: (item) => item.id,
    schema: todoSchema,
    onInsert: async ({ transaction }) => {}, // any standard schema
  })
);

setTimeout(() => {
  console.log("todoCollection", "重新设置值");
  todoCollection.insert([
    { id: 5, title: "Todo 5", completed: false },
    { id: 6, title: "Todo 6", completed: false },
    { id: 7, title: "Todo 7", completed: false },
  ]);
  // queryClient.refetchQueries(["todoItems"]);
  // queryClient.invalidateQueries(["todoItems"]);
}, 2000);

console.log("todoCollection", todoCollection.get("1"));

const houseCollection = createCollection(
  localStorageCollectionOptions({
    id: "house",
    storageKey: "house",
    storage: globalThis.localStorage,
    schema: houseDataSchema,

    getKey: (house) => house.id!,

    onInsert: ({ transaction, collection }) => {
      return Promise.resolve({ success: true });
    },
    onUpdate: ({ transaction, collection }) => {
      return Promise.resolve({ success: true });
    },
  })
);

export function useHouseDB() {
  const { data: todos } = useLiveQuery((q) =>
    q.from({ house: todoCollection })
  );

  console.log("todos", todos);

  const { data: houseDataSource } = useLiveQuery((q) =>
    q
      .from({ house: houseCollection })
      .orderBy(({ house }) => house.updated_at, "desc")
  );

  const initHouseRef = useRef(houseDataSource);

  useEffect(() => {
    const updated_at = initHouseRef.current[0]?.updated_at;
    syncHouse(updated_at, 1);
  }, []);

  return { houseDataSource };
}

// 同步房源数据
const PAGE_SIZE = 100;
const houseCollectionChache: Record<string, HouseData> = (() => {
  try {
    return JSON.parse(localStorage.getItem("HOUSE_COLLECTION_CHACHE") || "{}");
  } catch (error) {
    return {};
  }
})();

export async function syncHouse(updated_at?: string | null, page = 1) {
  const { list } = await getHouseList({
    updated_at,
    page,
    page_size: PAGE_SIZE,
  });

  let newItems = [];

  for (const item of list) {
    if (houseCollection.has(item.id!)) {
      houseCollection.update(item.id, (drafts) => {
        for (const key in item) {
          // @ts-ignore
          drafts[key] = item[key];
        }
      });
    } else {
      newItems.push(item);
    }
  }

  houseCollection.insert(newItems as any);
  if (list.length < PAGE_SIZE) {
    return;
  }

  requestAnimationFrame(() => {
    syncHouse(updated_at, page + 1);
  });
}
