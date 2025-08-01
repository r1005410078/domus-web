import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { PhotoSlider } from "react-photo-view";
import { DataType } from "react-photo-view/dist/types";

interface ModalContent {
  layout?: "center" | "left";
  title?: string;
}

export function useModalContent({ layout = "center", title }: ModalContent) {
  const [detail, openDetail] = useState<React.ReactNode | null>(null);
  const [images, openImages] = useState<DataType[] | null>(null);
  const [index, onIndexChange] = useState(0);

  const detailModal = (
    <>
      <Modal open={!!detail} onClose={() => openDetail(null)}>
        <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
          <ModalClose />
          {typeof detail === "string" ? (
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
          ) : (
            <>
              <DialogTitle>
                <Typography level="h2"> {title ?? "详情"}</Typography>
              </DialogTitle>
              <DialogContent>{detail}</DialogContent>
            </>
          )}
        </ModalDialog>
      </Modal>
      <PhotoSlider
        images={images || []}
        visible={!!images}
        onClose={() => {
          openImages(null);
          onIndexChange(0);
        }}
        index={index}
        onIndexChange={onIndexChange}
      />
    </>
  );

  return {
    detailModal,
    openDetail,
    openImages,
  };
}
