import {
  DialogContent,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { PhotoSlider } from "react-photo-view";
import { DataType } from "react-photo-view/dist/types";

interface ModalContent {
  layout?: "center" | "left";
}

export function useModalContent({ layout = "center" }: ModalContent) {
  const [detail, openDetail] = useState<React.ReactNode | null>(null);
  const [images, openImages] = useState<DataType[] | null>(null);

  const detailModal = (
    <>
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
            <Typography level="h1"> {detail}</Typography>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <PhotoSlider
        images={images || []}
        visible={!!images}
        onClose={() => openImages(null)}
        index={0}
      />
    </>
  );

  return {
    detailModal,
    openDetail,
    openImages,
  };
}
