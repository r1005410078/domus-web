import { Community, HouseForm } from "@/models/house";
import apiClient, { ResponseBody } from "./http";
import { AmapBounds, CommunityWithHouseCount } from "@/components/AMap";

type CreateHouseRequest = HouseForm;
// 创建房源
export function saveHouse(data: CreateHouseRequest) {
  return apiClient.post<ResponseBody<any>>(
    "/api/domus/management/house/save",
    data
  );
}

export interface HouseListRequest {
  page: number;
  page_size: number;
  transaction_type?: string;
  amap_bounds?: AmapBounds;
}

// 获取房源列表
export function getHouseList({
  page = 1,
  page_size = 10,
  ...params
}: HouseListRequest) {
  return apiClient.post<ResponseBody<{ list: HouseForm[]; total: number }>>(
    "/api/domus/query/house/list",
    {
      page,
      page_size,
      ...params,
    }
  );
}

// 根据id 获取房源信息
export function getHouseDetail(id: string) {
  return apiClient.get<ResponseBody<HouseForm>>(
    `/api/domus/query/house/detail/${id}`
  ); // 返回 token 等信息
}

// 获取小区列表
export async function getCommunityList() {
  const res = await apiClient.get<ResponseBody<{ list: Community[] }>>(
    "/api/domus/query/community/list?page=1&page_size=10000"
  );
  return res.data.data.list;
}

// 申请上传房源URL
export function applyUploadHouseUrl(data: {
  directory: string;
  filename: string;
}) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/management/house/apply_upload_url`,
    data
  );
}

// 根据小区分组
export function getCommunityByCommunity() {
  return apiClient.get<ResponseBody<CommunityWithHouseCount[]>>(
    "/api/domus/query/house/group_by_community"
  );
}
