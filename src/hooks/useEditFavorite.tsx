import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { Hue, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  save_favorite_categories,
  FavoriteCategoriesRequest,
  list_favorite_categories,
} from "@/services/favorte";
import { useToast } from "@/lib/ToastProvider";

export function useEditFavorite() {
  const [favorite, openFavorite] = useState<
    Partial<FavoriteCategoriesRequest> | null | undefined
  >(null);
  const [color, setColor] = useColor(favorite?.color || "green");
  const client = useQueryClient();
  const toast = useToast();

  const { mutate } = useMutation({
    mutationFn: (data: FavoriteCategoriesRequest) => {
      return save_favorite_categories(data);
    },
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }

      toast.showToast({ message: "保存成功", severity: "success" });
      client.refetchQueries({ queryKey: ["list_favorite_categories"] });
    },
  });

  const eidtFavorite = (
    <Modal
      key={favorite?.id}
      open={!!favorite}
      onClose={() => openFavorite(null)}
    >
      <ModalDialog>
        <DialogTitle>✍️ {favorite?.id ? "编辑" : "新建"}收藏夹</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const name = formData.get("name") as string;
            mutate({ ...favorite, name, color: color.hex });
            openFavorite(null);
          }}
        >
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>名称</FormLabel>
              <Input
                name="name"
                defaultValue={favorite?.name}
                autoFocus
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>颜色</FormLabel>
              <Hue color={color} onChange={setColor} />
            </FormControl>
            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  return {
    eidtFavorite,
    openFavorite,
  };
}
