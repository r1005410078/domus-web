"use client";

import {
  saveHouse,
  getHouseDetail,
  getHouseList,
  HouseListRequest,
  getCommunityByCommunity,
} from "@/services/house";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 根据id 获取房源信息
export function useGetHouseDetail(id?: string) {
  return useQuery({
    queryKey: ["useGetHouseDetail", id],
    queryFn: async () => {
      const res = await getHouseDetail(id!);

      const data = res.data.data;

      return data;
    },
    enabled: !!id,
  });
}

// 获取房源列表
export function useHouseList(params: HouseListRequest, enabled?: boolean) {
  const query = useQuery({
    queryKey: ["useHouseList", Object.values(params)],
    queryFn: async () => {
      const res = await getHouseList(params);
      return res;
    },
    enabled,
    placeholderData: (data) => data,
  });

  return query;
}

// 根据小区获取房源
export function useGetCommunityByCommunity(data: HouseListRequest) {
  return useQuery({
    queryKey: ["useGetCommunityByCommunity", data],
    placeholderData: (data) => data,
    queryFn: async () => {
      const res = await getCommunityByCommunity(data);
      return res.data.data;
    },
  });
}
