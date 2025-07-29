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

interface FavoriteCategories {
  color: string;
  created_at: string;
  id: number;
  name: string;
  user_id: string;
}
