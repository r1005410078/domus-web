import { z } from "zod";

export const doorNumberSchema = z.object({
  building_number: z.number("楼号不能空"),
  unit_number: z.number("单元号不能空"),
  door_number: z.number("室号不能空"),
});

export const floorRangeSchema = z.object({
  door_number_from: z.number().optional(),
  door_number_to: z.number().optional(),
});

export const apartmentTypeSchema = z.object({
  room: z.number("户型房间数量不能空"),
  hall: z.number().optional(),
  bathroom: z.number("户型卫数量不能空"),
  kitchen: z.number("户型厨数量不能空"),
  terrace: z.number().optional(),
  balcony: z.number().optional(),
});

export const stairsSchema = z.object({
  stairs: z.string().optional(),
  rooms: z.string().optional(),
});

export const houseOwnerSchema = z.object({
  id: z.string().optional(),
  name: z.string("房主姓名不能空"),
  phone: z.string("房主电话不能空"),
  id_card: z.string().optional(),
  id_card_images: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const communitySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  year_built: z.string().optional(),
  description: z.string().optional(),
  images: z.string().optional(),
  typecode: z.string(),
  lat: z.number(),
  lng: z.number(),
  district: z.string().optional(),
  adcode: z.string().optional(),
  updated_at: z.string().optional(),
});

export const fileInfoSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.string(),
  url: z.string(),
});

export const houseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  purpose: z.string("用途不能空"),
  transaction_type: z.string("交易类型不能空"),
  house_status: z.string("状态不能空"),
  floor_range: floorRangeSchema.optional(),
  door_number: doorNumberSchema.optional(),
  apartment_type: apartmentTypeSchema.optional(),
  building_area: z.number().optional(),
  use_area: z.number().optional(),
  floor_height: z.number().optional(),
  house_decoration: z.string().optional(),
  sale_price: z.number().optional(),
  rent_price: z.number().optional(),
  rent_low_price: z.number().optional(),
  down_payment: z.number().optional(),
  house_type: z.string().optional(),
  house_orientation: z.string().optional(),
  building_structure: z.string().optional(),
  building_year: z.string().optional(),
  property_rights: z.string().optional(),
  property_year_limit: z.string().optional(),
  certificate_date: z.string().optional(),
  handover_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  car_height: z.number().optional(),
  actual_rate: z.number().optional(),
  level: z.string().optional(),
  progress_depth: z.number().optional(),
  door_width: z.number().optional(),
  discount_year_limit: z.string().optional(),
  stairs: stairsSchema.optional(),
  owner: houseOwnerSchema,
  community: communitySchema,
  sale_low_price: z.number().optional(),
  view_method: z.string().optional(),
  payment_method: z.string().optional(),
  property_tax: z.string().optional(),
  degree: z.string().optional(),
  household: z.string().optional(),
  source: z.string().optional(),
  delegate_number: z.string().optional(),
  unique_housing: z.string().optional(),
  full_payment: z.string().optional(),
  mortgage: z.string().optional(),
  urgent: z.string().optional(),
  support: z.string().optional(),
  present_state: z.string().optional(),
  external_sync: z.string().optional(),
  remark: z.string().optional(),
  images: z.array(fileInfoSchema).optional(),
});

export const houseDataSchema = houseFormSchema.extend({
  id: z.string(),
  created_by: z.string(),
  updated_at: z.string().optional(),
  deleted_at: z.string().optional(),
});

export type HouseData = z.infer<typeof houseDataSchema>;
