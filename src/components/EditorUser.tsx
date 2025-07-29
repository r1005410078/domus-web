"use client";

import {
  usePermissionsDetailsList,
  useRoleList,
  useRoleMap,
  useSaveUser,
} from "@/hooks/useUser";
import { useToast } from "@/lib/ToastProvider";
import { User } from "@/models/user";
import { userRequestSchema } from "@/services/user";
import { getFirstError } from "@/utils";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

interface EditorUserProps {
  onClose: () => void;
  children?: React.ReactNode;
  user?: User | null;
}

export default function EditorUser({ onClose, user }: EditorUserProps) {
  const { data: roles } = useRoleList();
  const rolesMap = useRoleMap();
  const { mutate } = useSaveUser();
  const toast = useToast();

  const form = useForm({
    defaultValues: user,
    validators: {
      onChange: userRequestSchema as any,
    },
    onSubmit: async ({ value }) => {
      mutate({
        id: user?.user_id,
        username: value!.username,
        phone: value!.phone,
        email: value!.email,
        roles: value!.roles,
        password: value!.password,
      });
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [user]);

  return (
    <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <form.Field
          name="username"
          children={(field) => {
            return (
              <FormControl
                size="sm"
                disabled={user?.user_id ? true : false}
                required
              >
                <FormLabel>用户名称</FormLabel>
                <Input
                  placeholder="请输入"
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
                  value={field.state.value}
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
              <FormControl size="sm" required={user?.user_id ? false : true}>
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            );
          }}
        />

        <form.Field
          name="roles"
          children={(field) => {
            return (
              <FormControl size="sm">
                <FormLabel>角色</FormLabel>
                <Autocomplete
                  multiple={true}
                  options={roles?.map((r) => r.id) || []}
                  value={field.state.value}
                  onChange={(_, value) => {
                    field.handleChange(value);
                  }}
                  getOptionLabel={(id) => rolesMap?.get(id)?.name || ""}
                  renderOption={(props, id) => {
                    const option = rolesMap?.get(id);
                    return (
                      <AutocompleteOption {...props}>
                        <ListItemContent sx={{ fontSize: "sm" }}>
                          {option?.name}
                          <Typography level="body-xs">
                            {option?.description}
                          </Typography>
                        </ListItemContent>
                      </AutocompleteOption>
                    );
                  }}
                />
              </FormControl>
            );
          }}
        />
      </Sheet>
      <Button
        color="primary"
        onClick={() => {
          const errorsMessage = getFirstError(form.getAllErrors());
          if (errorsMessage) {
            toast.showToast({
              message: errorsMessage,
              severity: "danger",
            });
            return;
          }
          form.handleSubmit();
          onClose();
        }}
      >
        提交
      </Button>
    </Sheet>
  );
}
