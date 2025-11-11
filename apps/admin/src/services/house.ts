import { Community, HouseForm } from "@/models/house";
import apiClient, { ResponseBody } from "./http";
import { AmapBounds } from "@/components/AMap";
import { HouseCommentItem } from "@/models/comment";
import { HouseData } from "@/schema/house";
import { HouseOperationLog } from "@/schema/HouseOperationLog";

type CreateHouseRequest = HouseForm;
// 创建房源
export function saveHouse(data: CreateHouseRequest) {
  return apiClient.post<ResponseBody<any>>(
    "/api/domus/management/house/save",
    data
  );
}

// 删除房源
export function deleteHouse(id: string) {
  return apiClient.post<ResponseBody<any>>(
    `/api/domus/management/house/delete/${id}`
  );
}

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
  >("/api/domus/query/house/list", {
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

// 根据小区分组
export function getCommunityByCommunity(data: HouseListRequest) {
  return apiClient.post<ResponseBody<CommunityWithHouseCount[]>>(
    "/api/domus/query/house/group_by_community",
    data
  );
}

// 根据id 获取房源信息
export function getHouseDetail(id: string) {
  return apiClient.get<ResponseBody<HouseData>>(
    `/api/domus/query/house/detail/${id}`
  ); // 返回 token 等信息
}

export interface CommunityListRequest {
  page: number;
  page_size: number;
  updated_at?: string | null;
}

// 获取小区列表
export async function getCommunityList(
  data: CommunityListRequest = { page: 1, page_size: 10 }
) {
  const res = await apiClient.post<ResponseBody<{ list: Community[] }>>(
    "/api/domus/query/community/list",
    data
  );
  return res.data.data.list;
}

export interface AddCommentRequest {
  house_id: string;
  comment: string;
}

export function addComment(data: AddCommentRequest) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/management/house/add_comment`,
    data
  );
}

// 更新评论

export interface UpdateCommentRequest {
  comment_id: string;
  content: string;
}

export function updateComment(data: UpdateCommentRequest) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/management/house/update_comment`,
    data
  );
}

// 删除评论
export function deleteComment(comment_id: string) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/management/house/delete_comment/${comment_id}`
  );
}

// 获取评论列表
export async function getCommentList(house_id: string) {
  const res = await apiClient.get<ResponseBody<HouseCommentItem[]>>(
    `/api/domus/query/house/get_comments/${house_id}`
  );

  return res.data.data;
}

// 获取房源操作历史
export async function getHouseOperationLog(house_id: string) {
  const res = await apiClient.get<ResponseBody<HouseOperationLog[]>>(
    `/api/domus/query/house/house_operation_log/list/${house_id}`
  );

  return res.data.data;
}
