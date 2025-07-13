import * as React from "react";

import { Option, Select } from "@mui/joy";

export interface OrderSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function OrderSelector({ value, onChange }: OrderSelectorProps) {
  return (
    <Select
      defaultValue="出售"
      variant="plain"
      onChange={(_, value) => onChange(value!)}
      value={value || "出售"}
    >
      <Option value="出租">出租</Option>
      <Option value="出售">出售</Option>
    </Select>
  );
}
