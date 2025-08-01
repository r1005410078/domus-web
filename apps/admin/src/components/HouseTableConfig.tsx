import {
  apartmentTypeToString,
  communityToString,
  dateToString,
  emptyToString,
  floor_rangeToString,
  ownerToString,
  stairsToString,
} from "@/models/house";
import { HouseData, HouseForm } from "@/schema/house";
import type { ColDef } from "ag-grid-community";

export type IHouseRow = Partial<HouseForm>;

export const colDefs = [
  {
    headerName: "序号",
    valueGetter: (params: any) => params.node!.rowIndex! + 1,
    width: 100,
    pinned: "left",
    suppressMovable: true,
    cellClass: "ag-cell-center",
  },
  { field: "title", headerName: "房源标题", pinned: "left" },
  {
    field: "images",
    headerName: "图片",
    width: 100,
    cellRenderer: (params: any) =>
      params.value?.length ? `📷 共 ${params.value.length} 张` : null,
  },
  { field: "purpose", width: 100, headerName: "用途" },
  { field: "transaction_type", width: 100, headerName: "交易类型" },
  { field: "house_status", width: 100, headerName: "状态" },
  {
    field: "house_address",
    headerName: "地址(楼号/单元/门牌号)",
  },
  {
    field: "apartment_type",
    headerName: "户型结构",
    valueGetter: (params: any) =>
      apartmentTypeToString(params.data.apartment_type),
  },
  {
    field: "owner",
    headerName: "业主",
    width: 300,
    valueGetter: (params: any) => ownerToString(params.data.owner),
  },
  {
    field: "community",
    headerName: "小区",
    width: 500,
    valueGetter: (params: any) => communityToString(params.data.community),
  },
  { field: "property_management_company", headerName: "物业公司" },
  {
    field: "building_area",
    headerName: "建筑面积",
    valueGetter: (params: any) =>
      emptyToString(params.data?.building_area, "平方米"),
  },
  {
    field: "use_area",
    headerName: "使用面积",
    valueGetter: (params: any) => {
      return emptyToString(params.data.use_area, "平方米");
    },
  },
  {
    field: "floor_range",
    headerName: "楼层",
    valueGetter: (params: any) => floor_rangeToString(params.data.floor_range),
  },

  { field: "house_decoration", headerName: "装修" },
  {
    field: "sale_price",
    headerName: "售价",
    valueGetter: (params: any) =>
      emptyToString(params.data?.sale_price, "万元"),
  },
  {
    field: "sale_low_price",
    headerName: "出售低价",
    valueGetter: (params: any) =>
      emptyToString(params.data?.sale_low_price, "万元"),
  },
  {
    field: "rent_price",
    headerName: "租价",
    valueGetter: (params: any) =>
      emptyToString(params.data?.rent_price, "元/月"),
  },
  {
    field: "rent_low_price",
    headerName: "出租低价",
    valueGetter: (params: any) =>
      emptyToString(params.data?.rent_low_price, "元/月"),
  },
  {
    field: "down_payment",
    headerName: "首付",
    valueGetter: (params: any) => emptyToString(params.data?.down_payment, "%"),
  },
  { field: "house_type", headerName: "房屋类型" },
  { field: "house_orientation", headerName: "朝向" },
  { field: "building_structure", headerName: "建筑结构" },
  { field: "building_year", headerName: "建筑年代" },
  { field: "property_rights", headerName: "产权性质" },
  { field: "property_year_limit", headerName: "产权年限" },
  { field: "certificate_date", headerName: "产证日期" },
  { field: "handover_date", headerName: "交房日期" },
  { field: "tags", headerName: "推荐标签" },
  { field: "car_height", headerName: "车位高度" },
  { field: "actual_rate", headerName: "实率" },
  { field: "level", headerName: "级别" },
  { field: "progress_depth", headerName: "进深" },
  { field: "door_width", headerName: "门宽" },
  { field: "discount_year_limit", headerName: "满减年限" },
  {
    field: "stairs",
    headerName: "梯户",
    valueGetter: (params: any) => stairsToString(params.data.stairs),
  },
  { field: "view_method", headerName: "看房方式" },
  { field: "payment_method", headerName: "付款方式" },
  { field: "property_tax", headerName: "房源税费" },
  { field: "degree", headerName: "学位" },
  { field: "household", headerName: "户口" },
  { field: "source", headerName: "来源" },
  { field: "unique_housing", headerName: "唯一住房" },
  { field: "full_payment", headerName: "全款" },
  { field: "mortgage", headerName: "抵押" },
  { field: "urgent", headerName: "急切" },
  { field: "support", headerName: "配套" },
  { field: "present_state", headerName: "现状" },
  { field: "external_sync", headerName: "外网同步" },
  { field: "remark", headerName: "备注" },
  {
    field: "updated_at",
    headerName: "更新时间",
    cellRenderer: (params: any) => dateToString(params.data?.updated_at),
  },
].map((item: any) => {
  const newItem: ColDef<IHouseRow> = item;

  if (newItem.cellRenderer === undefined) {
    newItem.cellRenderer = (params: any) => {
      return emptyToString(params.value);
    };
  }

  return newItem;
});

export const colDefsMap = new Map(colDefs.map((item) => [item.field, item]));

export function getHouseDataByColDef<T>(dataList: T[]) {
  return dataList.map((item) => {
    const newItem = {};

    for (const field in item) {
      // @ts-ignore
      const valueGetter = colDefsMap.get(field)?.valueGetter;
      if (valueGetter) {
        // @ts-ignore
        newItem[`${field}#format`] = valueGetter({ data: item });
        // @ts-ignore
      }

      // @ts-ignore
      newItem[field] = item[field];
    }

    return newItem;
  }) as T[];
}
