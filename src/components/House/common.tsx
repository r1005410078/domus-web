"use client";

import {
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
} from "@mui/joy";
import { Community, HouseOwner } from "@/models/house";
import { useEffect, useMemo } from "react";
import { CommunitySelect, Poi } from "./CommunitySelect";
import { useState } from "react";

export interface CommunityFormProps {
  value?: Community;
  onChange: (value: Community) => void;
}

export function CommunityForm({
  value: propValue,
  onChange,
}: CommunityFormProps) {
  const poi = useMemo(() => {
    if (propValue?.location_id) {
      return {
        location_id: propValue.location_id,
        name: propValue.name,
        location: {
          lat: propValue.lat,
          lng: propValue.lng,
        },
        address: propValue.address,
        typecode: propValue.typecode,
        city: [propValue.city],
        district: propValue.district,
        adcode: propValue.adcode,
      } as Poi;
    }
    return;
  }, [propValue]);

  return (
    <CommunitySelect
      value={poi}
      onChange={(poi) => {
        if (poi) {
          onChange({
            id: poi.id, // 如果是服务器取的定有id，就更新
            location_id: poi.location_id, // 是地图检索的
            // 小区名称
            name: poi.name,
            // 小区地址
            address: poi.address,
            // 城市
            city: "安庆",
            // 位置
            lat: poi.location.lat,
            lng: poi.location.lng,
            // 区域
            district: poi.district,
            // 区域编码
            adcode: poi.adcode,
            // 小区类型
            typecode: poi.typecode,
          });
        }
      }}
    />
  );
}

export interface HouseOwnerFormProps {
  value?: HouseOwner;
  onChange: (value: HouseOwner) => void;
}

export function HouseOwnerForm({
  value: propValue,
  onChange,
}: HouseOwnerFormProps) {
  return (
    <>
      <FormControl required sx={{ gridColumn: "span 2" }}>
        <FormLabel>业主姓名</FormLabel>
        <InputDecorator
          placeholder="请输入"
          value={propValue?.name}
          onChange={(value) => {
            onChange({ ...propValue, name: value });
          }}
          endDecoratorSelect={{
            options: ownerNameOptions,
            defaultValue: "本人",
          }}
        />
      </FormControl>

      <FormControl required sx={{ gridColumn: "span 2" }}>
        <FormLabel>联系电话</FormLabel>
        <InputDecorator
          placeholder="请输入"
          value={propValue?.phone}
          onChange={(value) => {
            onChange({ ...propValue, phone: value });
          }}
          endDecoratorSelect={{
            options: ownerNameOptions,
            defaultValue: "本人",
          }}
        />
      </FormControl>
    </>
  );
}

export interface InputDecoratorProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  endDecoratorSelect: {
    defaultValue?: string;
    options: { label: string; value: string }[];
  };
}

export function InputDecorator(props: InputDecoratorProps) {
  const { value: propValue, placeholder, onChange, endDecoratorSelect } = props;
  const [inputValue, setInputValue] = useState(
    () => propValue?.split(":")?.[0] || ""
  );
  const [endValue, setEndValue] = useState(
    () => propValue?.split(":")?.[1] || endDecoratorSelect.defaultValue || ""
  );

  // Keep state in sync with propValue changes
  useEffect(() => {
    setInputValue(propValue?.split(":")?.[0] || "");
    setEndValue(
      propValue?.split(":")?.[1] || endDecoratorSelect.defaultValue || ""
    );
  }, [propValue, endDecoratorSelect.defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(`${val}:${endValue}`);
  };

  const handleSelectChange = (_: any, val: string | null) => {
    const selected = val ?? "";
    setEndValue(selected);
    onChange(`${inputValue}:${selected}`);
  };

  return (
    <Input
      placeholder={placeholder || "请输入"}
      name="owner_name"
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      endDecorator={
        <>
          <Divider orientation="vertical" />
          <FormControl>
            <Select
              variant="plain"
              value={endValue}
              onChange={handleSelectChange}
              slotProps={{
                listbox: {
                  variant: "outlined",
                },
              }}
              sx={{
                mr: -1.5,
                "&:hover": { bgcolor: "transparent" },
              }}
            >
              {endDecoratorSelect.options.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </FormControl>
        </>
      }
      sx={{ width: 300 }}
    />
  );
}

const ownerNameOptions = [
  {
    label: "本人",
    value: "本人",
  },
  {
    label: "配偶",
    value: "配偶",
  },
  {
    label: "亲戚",
    value: "亲戚",
  },
  {
    label: "朋友",
    value: "朋友",
  },
  {
    label: "子女",
    value: "子女",
  },
  {
    label: "授权委托人",
    value: "授权委托人",
  },
  {
    label: "二房东",
    value: "二房东",
  },
];
