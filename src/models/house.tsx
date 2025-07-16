import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 插件注册
dayjs.extend(utc);
dayjs.extend(timezone);

export interface DoorNumber {
  // 座栋
  building_number: number;
  // 单元
  unit_number: number;
  // 门牌
  door_number: number;
}

export interface FloorRange {
  // 最小楼层
  door_number_from?: number;
  // 最大楼层
  door_number_to?: number;
}

export interface ApartmentType {
  // 室
  room?: number;
  // 厅
  hall?: number;
  // 卫
  bathroom?: number;
  // 厨
  kitchen?: number;
  // 阳台
  terrace?: number;
  // 阁楼
  balcony?: number;
}

export interface Stairs {
  // 梯
  stairs?: string;
  // 户
  rooms?: string;
}

export interface HouseOwner {
  // 业主ID
  id?: string;
  // 业主姓名
  name?: string;
  // 业主电话
  phone?: string;
  // 业主身份证号
  id_card?: string;
  // 业主身份证照片
  id_card_images?: string[];
  // 业主情况
  description?: string;
}

export interface Community {
  id: string;
  // 小区名称
  name: string;
  // 小区地址
  address: string;
  // 城市
  city: string;
  // 小区年限
  year_built?: string;
  // 小区描述
  description?: string;
  // 小区图片
  images?: string;
  // 小区类型
  typecode: string;
  // 位置
  lat: number; // 纬度（如 "39.9235"）
  lng: number; // 经度（如 "116.428"）
  // 所属行政区（如“朝阳区”）
  district: string;
  // 所属行政区划代码（如“110105”，代表朝阳区）
  adcode: string;
  // 更新时间
  updated_at?: string;
}

export interface HouseForm {
  // 房源ID
  id?: string;
  // 房源标题
  title?: string;
  // 用途
  purpose: string;
  // 交易类型
  transaction_type: string;
  // 状态
  house_status: string;
  // 楼层
  floor_range?: FloorRange;

  // 门牌号结构
  door_number?: DoorNumber;

  // 户型结构
  apartment_type?: ApartmentType;

  /// 面积与装修
  // 建筑面积
  building_area?: number;
  // 使用面积
  use_area?: number;
  // 层高
  floor_height?: number;
  // 装修
  house_decoration?: string;

  //// 销售租赁信息
  // 售价
  sale_price?: number;
  // 租价
  rent_price?: number;
  // 出租低价
  rent_low_price?: number;
  // 首付
  down_payment?: number;

  //// 房屋结构与产权
  // 房屋类型
  house_type?: string;
  // 朝向
  house_orientation?: string;
  // 建筑结构
  building_structure?: string;
  // 建筑年代
  building_year?: number;
  // 产权性质
  property_rights?: string;
  // 产权年限
  property_year_limit?: string;
  // 产证日期
  certificate_date?: string;
  // 交房日期
  handover_date?: string;

  //// 标签和特征
  // 推荐标签
  tags?: string[];
  // 位置
  location?: string;
  // 车位高度
  car_height?: number;
  // 实率
  actual_rate?: number;
  // 级别
  level?: string;
  // 进深
  progress_depth?: number;
  // 门宽
  door_width?: number;

  /// 附加属性
  // 满减年限
  discount_year_limit?: string;
  // 梯户
  stairs?: Stairs;
  // 业主
  owner?: HouseOwner;
  // 小区
  community?: Community;
  // 出售低价
  sale_low_price?: number;
  // 看房方式
  view_method?: string;
  // 付款方式
  payment_method?: string;
  // 房源税费
  property_tax?: string;
  // 学位
  degree?: string;
  // 户口
  household?: string;
  // 来源
  source?: string;
  // 委托编号
  delegate_number?: string;
  // 唯一住房
  unique_housing?: string;
  // 全款
  full_payment?: string;
  // 抵押
  mortgage?: string;
  // 急切
  urgent?: string;
  // 配套
  support?: string;
  // 现状
  present_state?: string;
  // 外网同步
  external_sync?: string;
  // 备注
  remark?: string;
  // 图片
  images?: FileInfo[];

  // 更新时间
  updated_at?: string;
}

export interface FileInfo {
  name: string;
  type: string;
  size: string;
  url: string;
}

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

export function door_numberToString(data?: DoorNumber) {
  let str = "";

  if (data?.building_number) {
    str += `${data.building_number}号楼`;
  }

  if (data?.unit_number) {
    str += `/${data.unit_number}单元`;
  }

  if (data?.door_number) {
    str += `/${data.door_number}室`;
  }

  return str;
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
