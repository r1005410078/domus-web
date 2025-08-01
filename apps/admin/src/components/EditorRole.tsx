"use client";

import { usePermissionsDetailsList, useSaveRole } from "@/hooks/useUser";
import { useToast } from "@/lib/ToastProvider";
import { Role } from "@/models/user";
import { roleRequestSchema } from "@/services/user";
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

export interface EditorRoleProps {
  onClose: () => void;
  children?: React.ReactNode;
  role?: Role | null;
}

export default function EditorRole({ onClose, role }: EditorRoleProps) {
  const { data: permissions } = usePermissionsDetailsList();
  const { mutate } = useSaveRole();
  const toast = useToast();

  const form = useForm({
    defaultValues: role,
    // validators: {
    //   onChange: roleRequestSchema as any,
    // },
    onSubmit: async ({ value }) => {
      mutate({
        id: role?.id,
        name: value!.name,
        description: value!.description,
        permissions: value!.permissions?.map((p) => ({
          source: p.source,
          action: p.action,
        })),
      });
    },
  });

  useEffect(() => {
    form.reset(role);
  }, [role]);

  return (
    <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <form.Field
          name="name"
          children={(field) => {
            return (
              <FormControl size="sm" required>
                <FormLabel>角色名称</FormLabel>
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
          name="description"
          children={(field) => {
            return (
              <FormControl size="sm">
                <FormLabel>角色描述</FormLabel>
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
          name="permissions"
          children={(field) => {
            return (
              <FormControl size="sm">
                <FormLabel>权限</FormLabel>
                <Autocomplete
                  multiple={true}
                  options={permissions ?? []}
                  value={field.state.value}
                  onChange={(_, value) => {
                    field.handleChange(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <AutocompleteOption {...props}>
                      <ListItemContent sx={{ fontSize: "sm" }}>
                        {option.name}
                        <Typography level="body-xs">
                          {option.description}
                        </Typography>
                      </ListItemContent>
                    </AutocompleteOption>
                  )}
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
