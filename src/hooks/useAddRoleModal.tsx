"use client";

import EditorRole from "@/components/EditorRole";
import { Role } from "@/models/user";
import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import React from "react";

export function useAddRoleModal({
  layout,
}: {
  layout?: "center" | "fullscreen";
} = {}) {
  const [editItem, setEditItem] = React.useState<Partial<Role> | null>(null);

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
        <DialogTitle>添加角色</DialogTitle>
        <DialogContent>
          <EditorRole
            role={editItem as Role}
            onClose={() => setEditItem(null)}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  return {
    editorModal,
    openRoleEditModal: setEditItem,
  };
}
