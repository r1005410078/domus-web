"use client";

import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { localStorageCollectionOptions } from "@tanstack/db-collections";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { getHouseList } from "@/services/house";
import "@/utils/crypto-polyfill";
import { houseFormSchema } from "@/schema/house";

const houseCollection = createCollection(
  localStorageCollectionOptions({
    id: "house",
    storageKey: "house",
    storage: globalThis.localStorage,
    schema: houseFormSchema,
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
