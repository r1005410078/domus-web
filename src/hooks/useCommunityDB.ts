"use client";

import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { localStorageCollectionOptions } from "@tanstack/db-collections";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { getCommunityList } from "@/services/house";
import "@/utils/crypto-polyfill";

const communitySchema = z.object({
  id: z.string(),
  // 小区名称
  name: z.string(),
  // 小区地址
  address: z.string(),
  // 城市
  city: z.string(),
  // 小区年限
  year_built: z.string().nullable().optional(),
  // 小区描述
  description: z.string().nullable().optional(),
  // 小区图片
  images: z.array(z.string()).nullable().optional(),
  // 小区类型
  typecode: z.string(),
  // 位置
  lat: z.number(), // 纬度（如 "39.9235"）
  lng: z.number(), // 经度（如 "116.428"）
  // 所属行政区（如“朝阳区”）
  district: z.string(),
  // 所属行政区划代码（如“110105”，代表朝阳区）
  adcode: z.string(),
  updated_at: z.string().nullable().optional(),
});

const communityCollection = createCollection(
  localStorageCollectionOptions({
    id: "communitys",
    storageKey: "communitys",
    storage: globalThis.localStorage,
    schema: communitySchema,
    getKey: (todo) => todo.id,
    onInsert: ({ transaction, collection }) => {
      return Promise.resolve({ success: true });
    },
    onUpdate: ({ transaction, collection }) => {
      return Promise.resolve({ success: true });
    },
  })
);

export function useCommunityDB() {
  const { data: communitys } = useLiveQuery((q) =>
    q
      .from({ community: communityCollection })
      .orderBy(({ community }) => community.updated_at, "desc")
  );

  const initCommunityRef = useRef(communitys);

  useEffect(() => {
    const updated_at = initCommunityRef.current[0]?.updated_at;
    syncCommunity(updated_at, 1);
  }, []);

  return { communitys };
}

// 同步小区数据
const PAGE_SIZE = 100;
export async function syncCommunity(updated_at?: string | null, page = 1) {
  const list = await getCommunityList({
    updated_at,
    page,
    page_size: PAGE_SIZE,
  });

  let newItems = [];
  for (const item of list) {
    if (communityCollection.has(item.id)) {
      communityCollection.update(item.id, (drafts) => {
        for (const key in item) {
          // @ts-ignore
          drafts[key] = item[key];
        }
      });
    }

    newItems.push(item);
  }

  communityCollection.insert(newItems as any);
  if (list.length < PAGE_SIZE) {
    return;
  }

  requestAnimationFrame(() => {
    syncCommunity(updated_at, page + 1);
  });
}
