"use client";

import {
  getHouseDetail,
  getHouseList,
  HouseListRequest,
} from "@/services/house";
import { useQuery } from "@tanstack/react-query";

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
