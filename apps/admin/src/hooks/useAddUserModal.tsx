"use client";

import EditorUser from "@/components/EditorUser";
import { User } from "@/models/user";
import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import React from "react";

export function useAddUserModal({
  layout,
}: {
  layout?: "center" | "fullscreen";
} = {}) {
  const [editItem, setEditItem] = React.useState<Partial<User> | null>(null);

  const editorModal = (
    <Modal
      open={!!editItem}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        setEditItem(null);
      }}
    >
      <ModalDialog
        aria-labelledby="filter-modal"
        size="lg"
        layout={layout}
        sx={{ maxWidth: layout === "center" ? 300 : "100%" }}
      >
        <ModalClose />
        <DialogTitle>添加用户</DialogTitle>
        <DialogContent>
          <EditorUser
            user={editItem as User}
            onClose={() => setEditItem(null)}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  return {
    editorModal,
    openUserEditModal: setEditItem,
  };
}
