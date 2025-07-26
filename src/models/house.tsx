import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  apartmentTypeSchema,
  communitySchema,
  fileInfoSchema,
  floorRangeSchema,
  houseFormSchema,
  houseOwnerSchema,
  stairsSchema,
} from "@/schema/house";
import z from "zod";
import { en } from "zod/locales";

z.config(en());

// 插件注册
dayjs.extend(utc);
dayjs.extend(timezone);

export type FloorRange = z.infer<typeof floorRangeSchema>;

export type ApartmentType = z.infer<typeof apartmentTypeSchema>;

export type Stairs = z.infer<typeof stairsSchema>;

export type HouseOwner = z.infer<typeof houseOwnerSchema>;

export type Community = z.infer<typeof communitySchema>;

export type HouseForm = z.infer<typeof houseFormSchema>;

export type FileInfo = z.infer<typeof fileInfoSchema>;

export function communityToString(data?: Community) {
  let str = "";

  if (data?.name) {
    str += `${data.name}`;
  }

  if (data?.address) {
    str += ` / ${data.address}`;
  }

  return str;
}

export function ownerToString(data?: HouseOwner) {
  let str = "";

  if (data?.name) {
    str += `${data.name.split(":")[0]}`;
  }

  if (data?.phone) {
    str += `/${data.phone.split(":")[0]}`;
  }

  return str;
}

export function stairsToString(data?: Stairs) {
  let str = "";

  if (data?.stairs) {
    str += `${data.stairs}梯`;
  }

  if (data?.rooms) {
    str += `${data.rooms}户`;
  }

  return str;
}

export function apartmentTypeToString(data?: ApartmentType) {
  let str = "";

  if (data?.room) {
    str += `${data.room}室`;
  }

  if (data?.hall) {
    str += `${data.hall}厅`;
  }

  if (data?.bathroom) {
    str += `${data.bathroom}卫`;
  }

  if (data?.kitchen) {
    str += `${data.kitchen}厨`;
  }

  if (data?.terrace) {
    str += `${data.terrace}阳台`;
  }

  return str;
}

export function floor_rangeToString(data?: FloorRange) {
  if (!data?.door_number_from || !data?.door_number_to) {
    return "未知楼层";
  }

  return `${data?.door_number_from}-${data?.door_number_to}层`;
}

export function emptyToString<T>(data?: null | T, util?: string) {
  if (data) {
    if (util) {
      return `${data}${util}`;
    }
    return data;
  }
  return "";
}

export function dateToString(date?: string) {
  return dayjs.utc(date).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
}
