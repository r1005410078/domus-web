"use client";

import { getUserInformation } from "@/hooks/useLogin";
import {
  usePermissionsDetailsList,
  useRoleList,
  useRoleMap,
  useSaveUser,
  useUpdateUserProfile,
} from "@/hooks/useUser";
import { Permission, User, UserInfomation } from "@/models/user";
import { UpdateUserInfoRequest } from "@/services/user";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Sheet,
  Option,
  Typography,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";

interface EditUserProfileProps {
  onClose: () => void;
  children?: React.ReactNode;
}

export default function EditUserProfile({ onClose }: EditUserProfileProps) {
  const { mutate } = useUpdateUserProfile();
  const form = useForm({
    defaultValues: getUserInformation() as UpdateUserInfoRequest,

    onSubmit: async ({ value }) => {
      mutate({
        username: value?.username,
        phone: value?.phone,
        email: value?.email,
        roles: value?.roles,
        password: value?.password,
      });
    },
  });

  return (
    <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <form.Field
          name="username"
          children={(field) => {
            return (
              <FormControl size="sm" required>
                <FormLabel>用户名称</FormLabel>
                <Input
                  placeholder="请输入"
                  disabled
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            );
          }}
        />
        <form.Field
          name="phone"
          children={(field) => {
            return (
              <FormControl size="sm" required>
                <FormLabel>手机号</FormLabel>
                <Input
                  placeholder="请输入"
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            );
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            return (
              <FormControl size="sm">
                <FormLabel>密码</FormLabel>
                <Input
                  placeholder="请输入"
                  value={field.state.value}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            );
          }}
        />
        <form.Field
          name="email"
          children={(field) => {
            return (
              <FormControl size="sm">
                <FormLabel>邮箱</FormLabel>
                <Input
                  placeholder="请输入"
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            );
          }}
        />
      </Sheet>
      <Button
        color="primary"
        onClick={() => {
          form.handleSubmit();
          onClose();
        }}
      >
        提交
      </Button>
    </Sheet>
  );
}

interface EditUserProfileModal {
  layout: "center" | "fullscreen";
}

export function useEditUserProfileModal({ layout }: EditUserProfileModal) {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef(null);
  const openEditUserProfileModal = useCallback(() => {
    setOpen(true);
  }, []);

  const editUserProfileModal = (
    <Transition nodeRef={nodeRef} in={open} timeout={400}>
      {(state: string) => {
        return (
          <Modal
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
            keepMounted
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={[
              state === "exited"
                ? { visibility: "hidden" }
                : { visibility: "visible" },
            ]}
          >
            <ModalDialog
              layout={layout}
              sx={[
                {
                  opacity: 0,
                  transition: `opacity 300ms`,
                  ...{
                    entering: { opacity: 1 },
                    entered: { opacity: 1 },
                  }[state],
                },
              ]}
            >
              <ModalClose />
              <DialogTitle>编辑个人信息</DialogTitle>
              <DialogContent>
                <EditUserProfile onClose={() => setOpen(false)} />
              </DialogContent>
            </ModalDialog>
          </Modal>
        );
      }}
    </Transition>
  );
  return { editUserProfileModal, openEditUserProfileModal };
}
