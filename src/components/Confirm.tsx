"use client";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { create } from "zustand";

export interface ConfirmProps {
  title: string;
  content: string;
  onOK: (state: ConfirmState) => void;
  onCancel: (state: ConfirmState) => void;
}

export interface ConfirmState {
  props?: ConfirmProps | null;
  confirm: (open?: ConfirmProps | null) => void;
  close: () => void;
}

export const useConfirm = create<ConfirmState>((set) => ({
  props: null,
  confirm: (props?: ConfirmProps | null) => set({ props }),
  close: () => set({ props: null }),
}));

export const mdComfirm = useConfirm.getState().confirm;

export default function Confirm() {
  const state = useConfirm();
  return (
    <Modal open={!!state.props} onClose={() => state.close()}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          {state.props?.title}
        </DialogTitle>
        <Divider />
        <DialogContent>{state.props?.content}</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => state.props?.onOK(state)}
          >
            确定
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => state.props?.onCancel(state)}
          >
            取消
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
