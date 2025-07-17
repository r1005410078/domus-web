import { useToast } from "@/libs/ToastProvider";
import {
  saveHouse,
  getHouseDetail,
  getHouseList,
  HouseListRequest,
  getCommunityByCommunity,
} from "@/services/house";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSaveHouse() {
  const toast = useToast();
  const client = useQueryClient();

  return useMutation({
    mutationFn: saveHouse,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      client.invalidateQueries({ queryKey: ["useHouseList"] });
      client.invalidateQueries({ queryKey: ["useGetHouseDetail"] });
      toast.showToast({ message: "录入成功", severity: "success" });
    },
    onError: (err) => {
      toast.showToast({ message: `录入失败: ${err}`, severity: "danger" });
    },
  });
}

// 根据id 获取房源信息
export function useGetHouseDetail(id: string) {
  return useQuery({
    queryKey: ["useGetHouseDetail", id],
    queryFn: async () => {
      const res = await getHouseDetail(id);

      const data = res.data.data;

      return data;
    },
    enabled: id !== "",
  });
}

// 获取房源列表
export function useHouseList(params: HouseListRequest, enabled?: boolean) {
  return useQuery({
    queryKey: ["useHouseList", Object.values(params)],
    queryFn: async () => {
      const res = await getHouseList(params);
      return res;
    },
    enabled,
  });
}

// 根据小区获取房源
export function useGetCommunityByCommunity() {
  return useQuery({
    queryKey: ["useGetCommunityByCommunity"],
    queryFn: async () => {
      const res = await getCommunityByCommunity();
      return res.data.data;
    },
  });
}
