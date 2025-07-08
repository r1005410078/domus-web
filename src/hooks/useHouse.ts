import { useToast } from "@/libs/ToastProvider";
import {
  saveHouse,
  getHouseDetail,
  getHouseList,
  HouseListRequest,
} from "@/services/house";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSaveHouse() {
  const toast = useToast();

  return useMutation({
    mutationFn: saveHouse,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

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
    queryKey: [id],
    queryFn: async () => {
      const res = await getHouseDetail(id);

      const data = res.data.data;

      if (data.community) {
        data.community.location_id = data.community.id;
      }

      return data;
    },
    enabled: id !== "",
  });
}

// 获取房源列表
export function useHouseList(params: HouseListRequest) {
  return useQuery({
    queryKey: Object.values(params),
    queryFn: async () => {
      const res = await getHouseList(params);
      return res.data.data;
    },
  });
}
