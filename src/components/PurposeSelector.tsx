import * as React from "react";

import { Option, Select } from "@mui/joy";

export interface PurposeSelectorProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export default function PurposeSelector({
  value,
  onChange,
}: PurposeSelectorProps) {
  return (
    <Select
      variant="plain"
      multiple
      sx={{ minWidth: 80 }}
      onChange={(_, value) => onChange(value!)}
      value={value || []}
    >
      {[
        {
          label: "住宅",
          value: "住宅",
        },
        {
          label: "别墅",
          value: "别墅",
        },
        {
          label: "公寓",
          value: "公寓",
        },
        {
          label: "写字楼",
          value: "写字楼",
        },
        {
          label: "商铺",
          value: "商铺",
        },
        {
          label: "厂房",
          value: "厂房",
        },
        {
          label: "仓库",
          value: "仓库",
        },
        {
          label: "车位",
          value: "车位",
        },
      ].map((item) => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
}
