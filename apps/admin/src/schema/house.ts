import { z } from "zod";

export const floorRangeSchema = z.object({
  door_number_from: z.number().optional(),
  door_number_to: z.number().optional(),
});

export const apartmentTypeSchema = z.object({
  room: z.number("户型房间数量不能空"),
  // 厅
  hall: z.number().optional(),
  bathroom: z.number("户型卫数量不能空"),
  kitchen: z.number("户型厨数量不能空"),
  // 阳台
  terrace: z.number().optional(),
  // 阳台
  balcony: z.number().optional(),
});

export const stairsSchema = z.object({
  stairs: z.string().optional(),
  rooms: z.string().optional(),
});

export const houseOwnerSchema = z.object(
  {
    id: z.string().optional(),
    name: z.string("房主姓名不能空"),
    phone: z.string("房主电话不能空"),
    id_card: z.string().optional(),
    id_card_images: z.array(z.string()).optional(),
    description: z.string().optional(),
  },
  "联系人信息不能空"
);

export const fileInfoSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.string(),
  url: z.string(),
});

export const communitySchema = z.object(
  {
    id: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    year_built: z.string().optional(),
    description: z.string().optional(),
    images: z.array(fileInfoSchema).optional(),
    typecode: z.string(),
    lat: z.number(),
    lng: z.number(),
    district: z.string().optional(),
    adcode: z.string().optional(),
    updated_at: z.string().optional(),
    property_management_company: z.string().optional(),
    remark: z.string().optional(),
  },
  "小区不能空"
);

export const houseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string("标题不能空"),
  purpose: z.string("用途不能空"),
  transaction_type: z.string("交易类型不能空"),
  house_status: z.string("状态不能空"),
  floor_range: floorRangeSchema.optional(),
  house_address: z.string("地址不能空"),
  // 户型
  apartment_type: apartmentTypeSchema.optional(),
  // 建筑面积
  building_area: z.number("建筑面积不能空"),
  // 使用面积
  use_area: z.number().optional(),
  // 楼层
  floor_height: z.number().optional(),
  // 装修
  house_decoration: z.string().optional(),
  // 售价
  sale_price: z.number().optional(),
  sale_low_price: z.number().optional(),
  rent_price: z.number().optional(),
  rent_low_price: z.number().optional(),
  // 首付
  down_payment: z.number().optional(),
  // 房屋类型
  house_type: z.string().optional(),
  // 朝向
  house_orientation: z.string().optional(),
  // 建筑结构
  building_structure: z.string().optional(),
  // 建筑年代
  building_year: z.string().optional(),
  // 产权
  property_rights: z.string().optional(),
  //  产权年限
  property_year_limit: z.string().optional(),
  // 产证日期
  certificate_date: z.string().optional(),
  // 交房日期
  handover_date: z.string().optional(),
  // 标签
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  car_height: z.number().optional(),
  // 实率
  actual_rate: z.number().optional(),
  // 级别
  level: z.string().optional(),
  // 进深
  progress_depth: z.number().optional(),
  // 宽度
  door_width: z.number().optional(),
  // 满减年限
  discount_year_limit: z.string().optional(),
  // 楼户型
  stairs: stairsSchema.optional(),
  // 房主
  owner: houseOwnerSchema,
  // 小区
  community: communitySchema,
  // 小区物业
  property_management_company: z.string().optional(),
  // 看房方式
  view_method: z.string().optional(),
  // 付款方式
  payment_method: z.string().optional(),
  // 房源税费
  property_tax: z.string().optional(),
  // 学位
  degree: z.string().optional(),
  // 户口
  household: z.string().optional(),
  // 产权
  source: z.string().optional(),
  // 委托
  delegate_number: z.string().optional(),
  // 房屋状态
  unique_housing: z.string().optional(),
  // 房屋状态
  full_payment: z.string().optional(),
  // 抵押
  mortgage: z.string().optional(),
  // 急切
  urgent: z.string().optional(),
  // 配套
  support: z.string().optional(),
  // 现状
  present_state: z.string().optional(),
  // 外网同步
  external_sync: z.string().optional(),
  // 备注
  remark: z.string().optional(),
  images: z.array(fileInfoSchema).optional(),
});

export type HouseForm = z.infer<typeof houseFormSchema>;

export const houseDataSchema = houseFormSchema.extend({
  id: z.string(),
  created_by: z.string(),
  updated_at: z.string().optional(),
  deleted_at: z.string().optional(),
});

export const houseDataFuseKeys = [
  "title",
  "purpose",
  "transaction_type",
  "house_status",
  "floor_range#format",
  "house_address",
  // 户型
  "apartment_type#format",
  "apartment_type.room",
  "apartment_type.hall",
  "apartment_type.bathroom",
  "apartment_type.kitchen",
  "apartment_type.terrace",
  "apartment_type.balcony",

  // 建筑面积
  "building_area#format",
  // 使用面积
  "use_area#format",
  // 楼层
  "floor_height",
  // 装修
  "house_decoration",
  // 售价
  "sale_price#format",
  "sale_low_price#format",
  "rent_price#format",
  "rent_low_price#format",
  // 首付
  "down_payment#format",
  // 房屋类型
  "house_type",
  // 朝向
  "house_orientation",
  // 建筑结构
  "building_structure",
  // 建筑年代
  "building_year",
  // 产权
  "property_rights",
  //  产权年限
  "property_year_limit",
  // 产证日期
  "certificate_date",
  // 交房日期
  "handover_date",
  // 标签
  "tags",
  "location",
  "car_height",
  // 实率
  "actual_rate",
  // 级别
  "level",
  // 进深
  "progress_depth",
  // 宽度
  "door_width",
  // 满减年限
  "discount_year_limit",
  // 楼户型
  "stairs#format",
  // 房主
  "owner",
  "owner#format",
  "owner.name",
  "owner.phone",
  "owner.id_card",
  "owner.description",
  // 小区
  "community",
  "community#format",
  "community.name",
  "community.address",
  "community.year_built",
  "community.district",
  "community.description",
  "community.remark",
  // 小区物业
  "property_management_company",
  // 看房方式
  "view_method",
  // 付款方式
  "payment_method",
  // 房源税费
  "property_tax",
  // 学位
  "degree",
  // 户口
  "household",
  // 产权
  "source",
  // 委托
  "delegate_number",
  // 房屋状态
  "unique_housing",
  // 房屋状态
  "full_payment",
  // 抵押
  "mortgage",
  // 急切
  "urgent",
  // 配套
  "support",
  // 现状
  "present_state",
  // 外网同步
  "external_sync",
  // 备注
  "remark",
];

export type HouseData = z.infer<typeof houseDataSchema>;
