import { z } from "zod";

export const doorNumberSchema = z.object({
  building_number: z.number(),
  unit_number: z.number(),
  door_number: z.number(),
});

export const floorRangeSchema = z.object({
  door_number_from: z.number().nullable().optional(),
  door_number_to: z.number().nullable().optional(),
});

export const apartmentTypeSchema = z.object({
  room: z.number().nullable().optional(),
  hall: z.number().nullable().optional(),
  bathroom: z.number().nullable().optional(),
  kitchen: z.number().nullable().optional(),
  terrace: z.number().nullable().optional(),
  balcony: z.number().nullable().optional(),
});

export const stairsSchema = z.object({
  stairs: z.string().nullable().optional(),
  rooms: z.string().nullable().optional(),
});

export const houseOwnerSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  id_card: z.string().nullable().optional(),
  id_card_images: z.array(z.string()).nullable().optional(),
  description: z.string().nullable().optional(),
});

export const communitySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  year_built: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  images: z.string().nullable().optional(),
  typecode: z.string(),
  lat: z.number(),
  lng: z.number(),
  district: z.string(),
  adcode: z.string(),
  updated_at: z.string().nullable().optional(),
});

export const fileInfoSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.string(),
  url: z.string(),
});

export const houseFormSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  purpose: z.string(),
  transaction_type: z.string(),
  house_status: z.string(),
  floor_range: floorRangeSchema.nullable().optional(),
  door_number: doorNumberSchema.nullable().optional(),
  apartment_type: apartmentTypeSchema.nullable().optional(),
  building_area: z.number().nullable().optional(),
  use_area: z.number().nullable().optional(),
  floor_height: z.number().nullable().optional(),
  house_decoration: z.string().nullable().optional(),
  sale_price: z.number().nullable().optional(),
  rent_price: z.number().nullable().optional(),
  rent_low_price: z.number().nullable().optional(),
  down_payment: z.number().nullable().optional(),
  house_type: z.string().nullable().optional(),
  house_orientation: z.string().nullable().optional(),
  building_structure: z.string().nullable().optional(),
  building_year: z.number().nullable().optional(),
  property_rights: z.string().nullable().optional(),
  property_year_limit: z.string().nullable().optional(),
  certificate_date: z.string().nullable().optional(),
  handover_date: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  location: z.string().nullable().optional(),
  car_height: z.number().nullable().optional(),
  actual_rate: z.number().nullable().optional(),
  level: z.string().nullable().optional(),
  progress_depth: z.number().nullable().optional(),
  door_width: z.number().nullable().optional(),
  discount_year_limit: z.string().nullable().optional(),
  stairs: stairsSchema.nullable().optional(),
  owner: houseOwnerSchema.nullable().optional(),
  community: communitySchema.nullable().optional(),
  sale_low_price: z.number().nullable().optional(),
  view_method: z.string().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  property_tax: z.string().nullable().optional(),
  degree: z.string().nullable().optional(),
  household: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  delegate_number: z.string().nullable().optional(),
  unique_housing: z.string().nullable().optional(),
  full_payment: z.string().nullable().optional(),
  mortgage: z.string().nullable().optional(),
  urgent: z.string().nullable().optional(),
  support: z.string().nullable().optional(),
  present_state: z.string().nullable().optional(),
  external_sync: z.string().nullable().optional(),
  remark: z.string().nullable().optional(),
  images: z.array(fileInfoSchema).nullable().optional(),
  updated_at: z.string().nullable().optional(),
});
