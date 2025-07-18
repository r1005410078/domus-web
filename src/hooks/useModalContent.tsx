import { DialogContent, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useState } from "react";

interface ModalContent {
  layout?: "center" | "left";
}

export function useModalContent({ layout = "center" }: ModalContent) {
  const [detail, openDetail] = useState<React.ReactNode | null>(null);

  const detailModal = (
    <Modal open={!!detail} onClose={() => openDetail(null)}>
      <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
        <ModalClose />
        <DialogContent
          sx={[
            layout === "center" && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {detail}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );

  return {
    detailModal,
    openDetail,
  };
}
