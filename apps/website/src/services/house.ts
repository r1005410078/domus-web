import { Community, HouseForm } from "@/models/house";
import apiClient, { ResponseBody } from "./http";
import { AmapBounds } from "@/components/AMap";
import { HouseCommentItem } from "@/models/comment";
import { HouseData } from "@/schema/house";

type CreateHouseRequest = HouseForm;

export interface HouseListRequest {
  page: number;
  page_size: number;
  transaction_type?: string;
  amap_bounds?: AmapBounds;
  updated_at?: string;
  not_exclude_deleted?: boolean;
}

// 获取房源列表
export async function getHouseList({
  page = 1,
  page_size = 10,
  ...params
}: HouseListRequest) {
  const res = await apiClient.post<
    ResponseBody<{ list: HouseData[]; total: number }>
  >("/api/domus/public/house/list", {
    page,
    page_size,
    ...params,
  });
  return res.data.data;
}

export interface CommunityWithHouseCount {
  id: string;
  name: string;
  address: string;
  district: string;
  adcode: string;
  lat: number;
  lng: number;
  house_count: number;
}

// 根据id 获取房源信息
export function getHouseDetail(id: string) {
  return apiClient.get<ResponseBody<HouseData>>(
    `/api/domus/public/house/detail/${id}`
  ); // 返回 token 等信息
}

export interface CommunityListRequest {
  page: number;
  page_size: number;
  updated_at?: string | null;
}
