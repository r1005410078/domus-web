"use client";

import { usePermissionsDetailsList, useSaveRole } from "@/hooks/useUser";
import { Permission, Role } from "@/models/user";
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
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

interface EditorRoleProps {
  onClose: () => void;
  children?: React.ReactNode;
  role?: Partial<Role> | null;
}

export default function EditorRole({ onClose, role }: EditorRoleProps) {
  const { data: permissions } = usePermissionsDetailsList();
  const { mutate } = useSaveRole();

  const form = useForm({
    defaultValues: role,

    onSubmit: async ({ value }) => {
      mutate({
        id: role?.id,
        name: value?.name,
        description: value?.description,
        permissions: value?.permissions?.map((p) => ({
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
          form.handleSubmit();
          onClose();
        }}
      >
        提交
      </Button>
    </Sheet>
  );
}
