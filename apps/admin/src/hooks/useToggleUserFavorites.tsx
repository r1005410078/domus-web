import { useToast } from "@/lib/ToastProvider";
import {
  add_user_favorites,
  cancel_user_favorites,
  check_user_favorites,
  toggle_user_favorites,
  UserFavorites,
} from "@/services/favorte";
import {
  Button,
  DialogTitle,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useListFavoriteCategories } from "./useListFavoriteCategories";

export function useCheckUserFavorites(house_id?: string) {
  return useQuery({
    queryKey: ["checkUserFavorites", house_id],
    queryFn: () => check_user_favorites(house_id!),
    enabled: !!house_id,
  });
}

export function useToggleUserFavorites(house_id: string) {
  const toast = useToast();
  const client = useQueryClient();
  const [visible, setVisible] = useState(false);
  const { data: categories } = useListFavoriteCategories();
  const { data: isFavorite } = useCheckUserFavorites(house_id);

  const { mutate } = useMutation({
    mutationFn: async (category_id?: number) => {
      if (isFavorite) {
        return await cancel_user_favorites({ house_id });
      }
      return await add_user_favorites({ house_id, category_id });
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      if (isFavorite) {
        toast.showToast({ message: "取消收藏成功", severity: "success" });
      } else {
        toast.showToast({ message: "收藏成功", severity: "success" });
      }

      client.refetchQueries({ queryKey: ["checkUserFavorites"] });
      client.refetchQueries({ queryKey: ["list_favorite_categories"] });
      client.refetchQueries({ queryKey: ["useQueryListHouseFavorite"] });

      setVisible(false);
    },
    onError: (err) => {
      toast.showToast({ message: `收藏失败: ${err}`, severity: "danger" });
    },
  });

  // 收藏
  const toggleUserFavorites = () => {
    if (isFavorite) {
      // 取消收藏
      mutate(undefined);
      return;
    }

    if (!categories?.length) {
      // 如果没有收藏夹，就让服务端创建
      mutate(undefined);
      return;
    }

    setVisible(true);
  };

  const toggleUserFavoritesModal = (
    <Modal
      open={visible}
      onClose={(_, reason) => {
        setVisible(false);
      }}
    >
      <ModalDialog>
        <ModalClose />
        <DialogTitle>选择收藏夹</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            let category_id: any = formData.get("category_id");
            if (category_id) {
              category_id = Number(category_id);
            }
            mutate(category_id);
          }}
        >
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>收藏夹名称</FormLabel>
              <Select name="category_id" defaultValue={categories?.[0]?.id}>
                {categories?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <Button type="submit">确定</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  return {
    toggleUserFavoritesModal,
    toggleUserFavorites,
  };
}
