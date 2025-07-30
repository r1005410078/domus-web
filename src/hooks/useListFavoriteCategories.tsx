import { list_favorite_categories } from "@/services/favorte";
import { useQuery } from "@tanstack/react-query";

export function useListFavoriteCategories() {
  return useQuery({
    queryKey: ["list_favorite_categories"],
    queryFn: () => {
      return list_favorite_categories();
    },
  });
}
