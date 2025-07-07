import { Community, HouseForm } from "@/models/house";
import apiClient, { ResponseBody } from "./http";

type CreateHouseRequest = HouseForm;
// 创建房源
export function saveHouse(data: CreateHouseRequest) {
  if (data.id) {
    return apiClient.post<ResponseBody<any>>(
      "/api/domus/management/house/update",
      data
    ); // 返回 token 等信息
  }

  return apiClient.post<ResponseBody<any>>(
    "/api/domus/management/house/create",
    data
  ); // 返回 token 等信息
}

// 获取房源列表
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
  const data = res.data.data.list;
  return data.map((item) => {
    return {
      ...item,
      location_id: item.id,
    };
  });
}
