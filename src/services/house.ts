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

export interface HouseListRequest {
  page?: number;
  page_size?: number;
  transaction_type?: string;
}

// 获取房源列表
export function getHouseList({
  page = 1,
  page_size = 10,
  ...params
}: HouseListRequest) {
  return apiClient.get<ResponseBody<{ list: HouseForm[]; total: number }>>(
    "/api/domus/query/house/list",
    {
      params: {
        page,
        page_size,
        ...params,
      },
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
  const data = res.data.data.list;
  return data.map((item) => {
    return {
      ...item,
      location_id: item.id,
    };
  });
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
