"use client";

import { FormControl, FormLabel, Input } from "@mui/joy";
import { Community, HouseOwner } from "@/models/house";
import { useMemo } from "react";
import type { Poi } from "./CommunitySelect";
import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicCommunitySelectComponent = dynamic(
  () => import("@/components/House/CommunitySelect"),
  {
    loading: () => <p>加载中...</p>,
    ssr: false,
  }
);

export interface CommunityFormProps {
  value?: Community;
  onChange: (value: Community) => void;
}

export function CommunityForm({
  value: propValue,
  onChange,
}: CommunityFormProps) {
  const poi = useMemo(() => {
    if (propValue?.id) {
      return {
        id: propValue.id,
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
    <DynamicCommunitySelectComponent
      value={poi}
      key={poi?.id}
      onChange={(poi) => {
        if (poi) {
          onChange({
            id: poi.id, // 如果是服务器取的定有id，就更新
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
        <Input
          placeholder="请输入"
          value={propValue?.name}
          onChange={(e) => {
            const value = e.target.value;
            onChange({ ...propValue, name: value } as HouseOwner);
          }}
        />
      </FormControl>

      <FormControl required sx={{ gridColumn: "span 2" }}>
        <FormLabel>联系电话</FormLabel>
        <Input
          placeholder="请输入"
          value={propValue?.phone}
          onChange={(e) => {
            const value = e.target.value;
            onChange({ ...propValue, phone: value } as HouseOwner);
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
}

export function InputDecorator(props: InputDecoratorProps) {
  const { value: propValue, placeholder, onChange } = props;
  const [inputValue, setInputValue] = useState(() => propValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
  };

  return (
    <Input
      placeholder={placeholder || "请输入"}
      name="owner_name"
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      sx={{ width: 300 }}
    />
  );
}
