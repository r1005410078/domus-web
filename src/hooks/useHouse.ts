import { useToast } from "@/libs/ToastProvider";
import {
  saveHouse,
  getHouseDetail,
  getHouseList,
  HouseListRequest,
  getCommunityByCommunity,
  addComment,
  getCommentList,
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
      client.invalidateQueries({ queryKey: ["houseCollection"] });
      toast.showToast({ message: "保存成功", severity: "success" });
    },
    onError: (err) => {
      toast.showToast({ message: `保存失败: ${err}`, severity: "danger" });
    },
  });
}

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

// 保存评论
export function useAddComment() {
  const toast = useToast();
  const client = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: "评论失败", severity: "success" });
        return;
      }

      client.invalidateQueries({ queryKey: ["useCommentList"] });
    },
    onError: (err) => {
      toast.showToast({ message: `保存失败: ${err}`, severity: "danger" });
    },
  });
}

// 获取评论
export function useCommentList(house_id?: string) {
  return useQuery({
    queryKey: ["useCommentList", house_id],
    queryFn: async () => {
      const res = await getCommentList(house_id!);
      return res;
    },
    enabled: !!house_id,
  });
}
