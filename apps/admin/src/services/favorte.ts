import { HouseData } from "@/schema/house";
import apiClient, { ResponseBody } from "./http";

export interface FavoriteCategoriesRequest {
  id?: number;
  name: string;
  color: string;
}

export function save_favorite_categories(data: FavoriteCategoriesRequest) {
  if (data.id) {
    return apiClient.post<ResponseBody<any>>(
      `/api/domus/management/house/favorite_categories/update`,
      data
    );
  }
  return apiClient.post<ResponseBody<any>>(
    `/api/domus/management/house/favorite_categories/add`,
    data
  );
}

export function delete_favorite_categories(id: number) {
  return apiClient.post<ResponseBody<any>>(
    `/api/domus/management/house/favorite_categories/delete/${id}`
  );
}

export async function list_favorite_categories() {
  const res = await apiClient.get<ResponseBody<FavoriteCategories[]>>(
    `/api/domus/query/house/favorite_categories/list`
  );
  return res.data.data;
}

export interface FavoriteCategories {
  color: string;
  created_at: string;
  id: number;
  name: string;
  user_id: string;
}

export interface UserFavorites {
  id?: number;
  house_id: string;
  category_id?: number;
}

// 添加收藏
export async function add_user_favorites(data: UserFavorites) {
  const res = await apiClient.post<ResponseBody<UserFavorites>>(
    `/api/domus/management/house/user_favorites/add`,
    data
  );

  return res;
}

// 取消收藏
export async function cancel_user_favorites(data: UserFavorites) {
  return apiClient.post<ResponseBody<any>>(
    `/api/domus/management/house/user_favorites/cancel`,
    data
  );
}

// 是否收藏
export async function check_user_favorites(house_id: string) {
  const res = await apiClient.get<ResponseBody<boolean>>(
    `/api/domus/query/house/user_favorites/check/${house_id}`
  );

  return res.data.data;
}

// 如果收藏了就取消，如果没有收藏就添加
export async function toggle_user_favorites(data: UserFavorites) {
  const res = await check_user_favorites(data.house_id);
  if (res) {
    return await cancel_user_favorites(data);
  }

  return await add_user_favorites(data);
}

// 获取房源列表
export async function getFavoriteList(category_id: number) {
  const res = await apiClient.get<ResponseBody<HouseData[]>>(
    "/api/domus/query/house/user_favorites/list",
    {
      params: {
        category_id,
      },
    }
  );
  return res.data.data;
}
