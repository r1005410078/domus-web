import { Community, HouseForm } from "@/models/house";
import apiClient, { ResponseBody } from "./http";
import { AmapBounds, CommunityWithHouseCount } from "@/components/AMap";
import { HouseCommentItem } from "@/models/comment";

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
  updated_at?: string | null;
}

// 获取房源列表
export function getHouseList({
  page = 1,
  page_size = 10,
  ...params
}: HouseListRequest) {
  return apiClient
    .post<ResponseBody<{ list: HouseForm[]; total: number }>>(
      "/api/domus/query/house/list",
      {
        page,
        page_size,
        ...params,
      }
    )
    .then((res) => res.data.data);
}

// 根据id 获取房源信息
export function getHouseDetail(id: string) {
  return apiClient.get<ResponseBody<HouseForm>>(
    `/api/domus/query/house/detail/${id}`
  ); // 返回 token 等信息
}

interface CommunityListRequest {
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

// 添加评论

interface AddCommentRequest {
  house_id: string;
  comment: string;
}

export function addComment(data: AddCommentRequest) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/house_comment/add_comment`,
    data
  );
}

// 更新评论

interface UpdateCommentRequest {
  comment_id: string;
  content: string;
}

export function updateComment(data: UpdateCommentRequest) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/house_comment/update_comment`,
    data
  );
}

// 删除评论
export function deleteComment(comment_id: string) {
  return apiClient.post<ResponseBody<string>>(
    `/api/domus/house_comment/delete_comment/${comment_id}`
  );
}

// 获取评论列表
export async function getCommentList(house_id: string) {
  const res = await apiClient.get<ResponseBody<HouseCommentItem[]>>(
    `/api/domus/house_comment/get_comments/${house_id}`
  );

  return res.data.data;
}
