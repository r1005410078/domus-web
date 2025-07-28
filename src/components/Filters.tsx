import * as React from "react";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import PurposeSelector, { PurposeSelectorProps } from "./PurposeSelector";
import { useForm, useStore } from "@tanstack/react-form";
import { CommunityForm } from "./House/common";
import { ApartmentType, Community } from "@/models/house";
import {
  EditApartmentType,
  EditHouseDecoration,
  EditHouseOrientation,
} from "./EditDetail";
import { Autocomplete, Box, CircularProgress, IconButton } from "@mui/joy";

export interface FiltersProps {
  // 交易类型
  transactionType: string;
  // 提交函数
  onFilterSubmit: (values: FiltersForm) => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export interface FiltersForm {
  purpose?: string;
  apartment_type?: ApartmentType;
  price?: string;
  rent?: string;
  house_orientation?: string;
  area?: string;
  house_decoration?: string;
  floor?: string;
  transaction_type?: string;
}

export default function Filters({
  transactionType,
  onFilterSubmit,
  loading,
  children,
}: FiltersProps) {
  const [resetKey, setResetKey] = React.useState(Date.now());
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    defaultValues: {
      purpose: "住宅",
      transaction_type: transactionType,
    } as FiltersForm,
    onSubmit: ({ value }) => {
      onFilterSubmit(value);
      setOpen(false);
    },
  });

  const { purpose } = useStore(form.store, (state) => {
    return {
      purpose: state.values?.purpose,
    };
  });

  React.useEffect(() => {
    // 提交
    form.handleSubmit({
      transaction_type: transactionType,
      purpose,
    });
  }, [transactionType, purpose]);

  return (
    <Stack
      key={resetKey}
      useFlexGap
      direction="row"
      spacing={0}
      sx={{ pt: 1, pb: 1 }}
    >
      <Box sx={{ flex: 1, pl: 1.2 }}>{children}</Box>
      <IconButton
        loading={loading}
        sx={{
          "--IconButton-size": "40px",
        }}
        onClick={() => setOpen(true)}
      >
        <FilterAltOutlined />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Stack useFlexGap spacing={3} sx={{ p: 2 }}>
          <DialogTitle>高级检索</DialogTitle>
          <ModalClose />
          <form.Field
            name="purpose"
            children={(field) => {
              return (
                <PurposeSelector
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value);
                  }}
                />
              );
            }}
          />
          <form.Field
            name="apartment_type"
            children={(field) => {
              return (
                <EditApartmentType
                  required={false}
                  value={field.state.value}
                  onChange={(value) => {
                    for (const key in value) {
                      // @ts-ignore
                      if (value[key] === 0) {
                        // @ts-ignore
                        delete value[key];
                      }
                    }
                    field.handleChange(value);
                  }}
                />
              );
            }}
          />
          <form.Field
            name="house_orientation"
            children={(field) => {
              return (
                <EditHouseOrientation
                  required={false}
                  value={field.state.value}
                  purpose={purpose}
                  onChange={(value) => {
                    field.handleChange(value);
                  }}
                />
              );
            }}
          />
          <form.Field
            name="area"
            children={(field) => {
              return (
                <FormControl>
                  <FormLabel>面积</FormLabel>
                  <Autocomplete
                    name="area"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(_, value) => field.handleChange(value as string)}
                    getOptionLabel={(option) => `${option}㎡`}
                    options={[
                      "0-50",
                      "50-70",
                      "70-90",
                      "90-120",
                      "120-150",
                      "150+",
                    ]}
                  />
                </FormControl>
              );
            }}
          />
          {transactionType === "出售" && (
            <form.Field
              name="price"
              children={(field) => {
                return (
                  <FormControl>
                    <FormLabel>售价</FormLabel>
                    <Autocomplete
                      name="price"
                      placeholder="请输入"
                      value={field.state.value}
                      onChange={(_, value) =>
                        field.handleChange(value as string)
                      }
                      getOptionLabel={(option) => `${option}万`}
                      options={["0-20", "20-50", "50-100", "100-200", "200+"]}
                    />
                  </FormControl>
                );
              }}
            />
          )}
          {transactionType === "出租" && (
            <form.Field
              name="rent"
              children={(field) => {
                return (
                  <FormControl>
                    <FormLabel>租金</FormLabel>
                    <Autocomplete
                      name="rent"
                      placeholder="请输入"
                      value={field.state.value}
                      onChange={(_, value) =>
                        field.handleChange(value as string)
                      }
                      getOptionLabel={(option) => `${option}元/月`}
                      options={[
                        "0-1000",
                        "1000-2000",
                        "2000-3000",
                        "3000-5000",
                        "5000+",
                      ]}
                    />
                  </FormControl>
                );
              }}
            />
          )}
          <form.Field
            name="house_decoration"
            children={(field) => {
              return (
                <EditHouseDecoration
                  purpose={purpose}
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              );
            }}
          />
          <form.Field
            name="floor"
            children={(field) => {
              return (
                <FormControl>
                  <FormLabel>楼层</FormLabel>
                  <Autocomplete
                    name="floor"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(_, value) => field.handleChange(value as string)}
                    getOptionLabel={(option) => {
                      switch (option) {
                        case "low":
                          return "低楼层";
                        case "middle":
                          return "中楼层";
                        default:
                          return "高楼层";
                      }
                    }}
                    options={["low", "middle", "high"]}
                  />
                </FormControl>
              );
            }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              type="reset"
              onClick={() => {
                setResetKey(Date.now());
                form.reset({
                  apartment_type: undefined,
                  price: undefined,
                  rent: undefined,
                  house_orientation: undefined,
                  area: undefined,
                  house_decoration: undefined,
                  floor: undefined,
                });
                form.handleSubmit();
              }}
              sx={{ ml: 1 }}
            >
              重置
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                form.handleSubmit();
                setOpen(false);
              }}
            >
              确认
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}
