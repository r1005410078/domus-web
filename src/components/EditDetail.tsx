import { useSaveHouse } from "@/hooks/useHouse";
import {
  ApartmentType,
  Community,
  DoorNumber,
  FileInfo,
  FloorRange,
  HouseForm,
  Stairs,
} from "@/models/house";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Select,
  Stack,
  Typography,
  Option,
  Divider,
  Textarea,
  ModalClose,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useForm } from "@tanstack/react-form";
import React, { useMemo } from "react";
import { Transition } from "react-transition-group";
import { CommunityForm, HouseOwnerForm } from "./House/common";
import DropZone, { useUploadFiles } from "./House/DropZone";

const houseFormComponent: Partial<
  Record<keyof HouseForm, React.ComponentType<FormChange<any>>>
> = {};

// 注册组件
export function registerHouseFormComponent(
  key: keyof HouseForm,
  component: React.ComponentType<FormChange<any>>
) {
  houseFormComponent[key] = component;
}

export interface EditDetailDrawerProps {
  detailEditField?: keyof HouseForm;
  houseDetail: HouseForm;
  onSave?: (data: HouseForm) => void;
  onClose: () => void;
}

export function EditDetailDrawer({
  detailEditField,
  houseDetail,
  onClose,
  onSave,
}: EditDetailDrawerProps) {
  const { uploads } = useUploadFiles();
  const { mutate } = useSaveHouse();
  const nodeRef = React.useRef(null);
  const form = useForm({
    defaultValues: houseDetail,
    onSubmit: async ({ value }) => {
      onSave?.(value);
      mutate(value);
    },
  });

  React.useEffect(() => {
    form.reset(houseDetail);
  }, [houseDetail]);

  return (
    <Transition nodeRef={nodeRef} in={!!detailEditField} timeout={100}>
      {(state: string) => {
        return (
          <Modal
            open={!["exited", "exiting"].includes(state)}
            onClose={(_, reason) => {
              if (reason === "backdropClick") return;
              onClose();
            }}
            keepMounted
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 100ms, backdrop-filter 100ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={[
              state === "exited"
                ? { visibility: "hidden" }
                : { visibility: "visible" },
            ]}
          >
            <ModalDialog
              layout={detailEditField === "images" ? "fullscreen" : "center"}
              sx={[
                {
                  opacity: 0,
                  transition: `opacity 300ms`,
                  ...{
                    entering: { opacity: 1 },
                    entered: { opacity: 1 },
                  }[state],
                },
                { maxWidth: detailEditField === "images" ? "100%" : 560 },
              ]}
            >
              <ModalClose />
              <DialogTitle>修改房源</DialogTitle>
              <DialogContent>
                {detailEditField && (
                  <Stack spacing={2}>
                    <form.Field
                      name={detailEditField!}
                      children={(field) => {
                        const Component = houseFormComponent[detailEditField!];
                        if (Component) {
                          return (
                            <Component
                              value={field.state.value}
                              onChange={field.handleChange}
                              purpose={houseDetail.purpose}
                              transaction_type={houseDetail.transaction_type}
                              community_name={houseDetail.community?.name}
                            />
                          );
                        }

                        return <>找不到编辑组件 {detailEditField}</>;
                      }}
                    />
                    <Button
                      onClick={async () => {
                        await uploads();
                        await form.handleSubmit();
                        onClose();
                      }}
                    >
                      保存
                    </Button>
                  </Stack>
                )}
              </DialogContent>
            </ModalDialog>
          </Modal>
        );
      }}
    </Transition>
  );
}

export interface Relation {
  purpose?: string;
  transaction_type?: string;
}

export interface FormChange<T> {
  onChange: (value: T) => void;
  value?: T;
  sx?: SxProps;
  purpose?: string;
  transaction_type?: string;
  community_name?: string;
  required?: boolean;
}

const isShowRelation = (
  compare: Relation[],
  current: { purpose?: string; transaction_type?: string }
) => {
  return compare.some((item) => {
    let isHas = true;
    if (item.purpose) {
      isHas = item.purpose === current.purpose;
    }

    if (item.transaction_type && isHas) {
      isHas = item.transaction_type === current.transaction_type;
    }

    return isHas;
  });
};

// 用途
registerHouseFormComponent("purpose", EditPurposeSelector);
export function EditPurposeSelector({
  value,
  onChange,
  sx,
}: FormChange<string>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>用途</FormLabel>
      <Select
        placeholder="请输入"
        name="purpose"
        value={value}
        onChange={(_, value) => onChange(value as string)}
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
    </FormControl>
  );
}

// 交易类型
registerHouseFormComponent("transaction_type", EditTransactionType);
export function EditTransactionType({
  value,
  onChange,
  sx,
  required = true,
}: FormChange<string>) {
  return (
    <FormControl required={required} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>交易类型</FormLabel>
      <Select
        placeholder="请输入"
        name="transaction_type"
        value={value}
        onChange={(_, value) => {
          onChange(value as string);
        }}
      >
        {[
          {
            label: "出售",
            value: "出售",
          },
          {
            label: "出租",
            value: "出租",
          },
          {
            label: "租售",
            value: "租售",
          },
        ].map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
}

// 状态
registerHouseFormComponent("house_status", EditTransactionType);
export function EditHouseStatus({ value, onChange, sx }: FormChange<string>) {
  return (
    <FormControl sx={[...(Array.isArray(sx) ? sx : [sx])]} required>
      <FormLabel>状态</FormLabel>
      <Select
        value={value}
        placeholder="请选择"
        name="house_status"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "有效",
            value: "有效",
          },
          {
            label: "暂缓",
            value: "暂缓",
          },
          {
            label: "未知",
            value: "未知",
          },
          {
            label: "他租",
            value: "他租",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 房源拥有者
registerHouseFormComponent("owner", HouseOwnerForm);

// 售价
registerHouseFormComponent("sale_price", EditSalePrice);

export function EditSalePrice({ value, onChange, sx }: FormChange<number>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>售价</FormLabel>
      <Input
        placeholder="请输入"
        name="sale_price"
        type="number"
        endDecorator={<span>万元</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 出售低价
registerHouseFormComponent("sale_low_price", EditSaleLowPrice);

export function EditSaleLowPrice({ value, onChange, sx }: FormChange<number>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>出售低价</FormLabel>
      <Input
        placeholder="请输入"
        name="sale_low_price"
        type="number"
        endDecorator={<span>万元</span>}
        value={value as number}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 租价
registerHouseFormComponent("rent_price", EditRentPrice);

export function EditRentPrice({ value, onChange, sx }: FormChange<number>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>租价</FormLabel>
      <Input
        placeholder="请输入"
        name="rent_price"
        type="number"
        endDecorator={<span>元/月</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 出租低价
registerHouseFormComponent("rent_low_price", EditRentLowPrice);

export function EditRentLowPrice({ value, onChange, sx }: FormChange<number>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>出租低价</FormLabel>
      <Input
        placeholder="请输入"
        name="rent_low_price"
        type="number"
        endDecorator={<span>元</span>}
        value={value as number}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 首付
registerHouseFormComponent("down_payment", EditDownPayment);

export function EditDownPayment({ value, onChange, sx }: FormChange<number>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>首付</FormLabel>
      <Input
        placeholder="请输入"
        name="down_payment"
        type="number"
        endDecorator={<span>%</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 小区
registerHouseFormComponent("community", EditCommunity);

export function EditCommunity({ value, onChange, sx }: FormChange<Community>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>小区</FormLabel>
      <CommunityForm value={value} onChange={onChange} />
    </FormControl>
  );
}

// 门牌号
registerHouseFormComponent("door_number", EditDoorNumber);

export function EditDoorNumber({
  value,
  onChange,
  sx,
}: FormChange<DoorNumber>) {
  return (
    <FormControl required sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>门牌号</FormLabel>
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Stack spacing={1} direction="row">
          <FormControl>
            <Input
              style={{ width: "150px" }}
              placeholder="请输入"
              value={value?.building_number}
              type="number"
              onChange={(e) =>
                onChange({
                  ...((value ?? {}) as any),
                  building_number: Number(e.target.value),
                })
              }
              endDecorator={<span>号楼</span>}
            />
          </FormControl>
          <Divider orientation="vertical" />
          <FormControl>
            <Input
              style={{ width: "150px" }}
              placeholder="请输入"
              type="number"
              value={value?.unit_number}
              onChange={(e) =>
                onChange({
                  ...((value ?? {}) as any),
                  unit_number: Number(e.target.value),
                })
              }
              endDecorator={<span>单元</span>}
            />
          </FormControl>
        </Stack>
        <FormControl>
          <Input
            fullWidth
            style={{ width: "150px" }}
            placeholder="请输入"
            type="number"
            value={value?.door_number}
            name="door_number"
            onChange={(e) =>
              onChange({
                ...((value ?? {}) as any),
                door_number: Number(e.target.value),
              })
            }
            endDecorator={<span>号</span>}
          />
        </FormControl>
      </Stack>
    </FormControl>
  );
}

// 户型
registerHouseFormComponent("apartment_type", EditApartmentType);

export function EditApartmentType({
  value,
  onChange,
  sx,
  required = true,
}: FormChange<ApartmentType>) {
  return (
    <FormControl required={required} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <FormLabel>户型</FormLabel>
      <Stack spacing={1} direction="row" useFlexGap sx={{ flexWrap: "wrap" }}>
        <FormControl style={{ width: 115 }}>
          <Input
            placeholder="请输入"
            name="room"
            type="number"
            value={value?.room}
            onChange={(e) =>
              onChange({
                ...((value ?? {}) as any),
                room: Number(e.target.value),
              })
            }
            endDecorator={<span>室</span>}
          />
        </FormControl>

        <FormControl style={{ width: 115 }}>
          <Input
            placeholder="请输入"
            name="hall"
            type="number"
            value={value?.hall}
            onChange={(e) =>
              onChange({
                ...((value ?? {}) as any),
                hall: Number(e.target.value),
              })
            }
            endDecorator={<span>厅</span>}
          />
        </FormControl>

        <FormControl style={{ width: 115 }}>
          <Input
            placeholder="请输入"
            name="bathroom"
            type="number"
            value={value?.bathroom}
            onChange={(e) => {
              onChange({
                ...((value ?? {}) as any),
                bathroom: Number(e.target.value),
              });
            }}
            endDecorator={<span>卫</span>}
          />
        </FormControl>
        <FormControl style={{ width: 115 }}>
          <Input
            placeholder="请输入"
            name="kitchen"
            type="number"
            value={value?.kitchen}
            onChange={(e) => {
              onChange({
                ...((value ?? {}) as any),
                kitchen: Number(e.target.value),
              });
            }}
            endDecorator={<span>厨</span>}
          />
        </FormControl>
        <FormControl style={{ width: 130 }}>
          <Input
            placeholder="请输入"
            name="balcony"
            type="number"
            value={value?.balcony}
            onChange={(e) => {
              onChange({
                ...((value ?? {}) as any),
                balcony: Number(e.target.value),
              });
            }}
            endDecorator={<span>阳台</span>}
          />
        </FormControl>
      </Stack>
    </FormControl>
  );
}

// 房源标题
registerHouseFormComponent("title", EditHouseTitle);

export function EditHouseTitle({ value, onChange }: FormChange<string>) {
  return (
    <FormControl required>
      <FormLabel>房源标题</FormLabel>
      <Input
        placeholder="请输入"
        name="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// 楼层
registerHouseFormComponent("floor_range", EditFloorRange);
export function EditFloorRange({ value, onChange }: FormChange<FloorRange>) {
  return (
    <FormControl>
      <FormLabel>楼层</FormLabel>
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
        <FormControl>
          <Input
            style={{ width: "100px" }}
            placeholder="请输入"
            name="door_number_from"
            type="number"
            value={value?.door_number_from}
            onChange={(e) => {
              onChange({
                ...((value ?? {}) as any),
                door_number_from: Number(e.target.value),
              });
            }}
          />
        </FormControl>
        <Divider orientation="vertical">到</Divider>
        <FormControl>
          <Input
            style={{ width: "100px" }}
            placeholder="请输入"
            name="door_number_to"
            type="number"
            value={value?.door_number_to}
            onChange={(e) =>
              onChange({
                ...((value ?? {}) as any),
                door_number_to: Number(e.target.value),
              })
            }
          />
        </FormControl>
        <Divider orientation="vertical">层</Divider>
      </Stack>
    </FormControl>
  );
}

// 推荐标签
registerHouseFormComponent("tags", EditTags);
export function EditTags({ value, onChange }: FormChange<string[]>) {
  return (
    <FormControl>
      <FormLabel>推荐标签</FormLabel>
      <Select
        multiple
        placeholder="请输入"
        name="tags"
        value={value}
        onChange={(e, value) => onChange(value as string[])}
      >
        {[
          {
            label: "免税",
            value: "免税",
          },
          {
            label: "交通便利",
            value: "交通便利",
          },
          {
            label: "学区房",
            value: "学区房",
          },
          {
            label: "地铁房",
            value: "地铁房",
          },
          {
            label: "采光好",
            value: "采光好",
          },
          {
            label: "环境好",
            value: "环境好",
          },
          {
            label: "配套齐全",
            value: "配套齐全",
          },
          {
            label: "优质地段",
            value: "优质地段",
          },
          {
            label: "临街旺铺",
            value: "临街旺铺",
          },
          {
            label: "人流密集",
            value: "人流密集",
          },
          {
            label: "紧邻地铁",
            value: "紧邻地铁",
          },
          {
            label: "交通要塞",
            value: "交通要塞",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 车位高度
registerHouseFormComponent("car_height", EditCarHeight);
export function EditCarHeight({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>车位高度</FormLabel>
      <Input
        placeholder="请输入"
        type="number"
        name="car_height"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        endDecorator={<span>米</span>}
      />
    </FormControl>
  );
}

// 梯户
registerHouseFormComponent("stairs", EditStairs);
export function EditStairs({ value, onChange }: FormChange<Stairs>) {
  return (
    <FormControl>
      <FormLabel>梯户</FormLabel>
      <Stack spacing={1} direction="row" useFlexGap>
        <FormControl>
          <Input
            placeholder="请输入"
            name="stairs"
            type="number"
            style={{ width: 130 }}
            value={value?.stairs}
            onChange={(e) => {
              onChange({
                ...value,
                stairs: e.target.value,
              });
            }}
            endDecorator={<span>梯</span>}
          />
        </FormControl>
        <FormControl>
          <Input
            placeholder="请输入"
            name="rooms"
            style={{ width: 130 }}
            type="number"
            endDecorator={<span>户</span>}
            value={value?.rooms}
            onChange={(e) => {
              onChange({
                ...value,
                rooms: e.target.value,
              });
            }}
          />
        </FormControl>
      </Stack>
    </FormControl>
  );
}

// 实率
registerHouseFormComponent("actual_rate", EditActualRate);

export function EditActualRate({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>实率</FormLabel>
      <Input
        placeholder="请输入"
        name="actual_rate"
        type="number"
        endDecorator={<span>%</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 级别
registerHouseFormComponent("level", EditLevel);
export function EditLevel({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>级别</FormLabel>
      <Stack spacing={1} direction="row" useFlexGap>
        <Select
          placeholder="请选择"
          name="level"
          value={value}
          onChange={(e, value) => {
            onChange(value!);
          }}
          sx={{ width: 200 }}
        >
          {[
            {
              label: "A级",
              value: "A级",
            },
            {
              label: "B级",
              value: "B级",
            },
            {
              label: "C级",
              value: "C级",
            },
            {
              label: "投资级",
              value: "投资级",
            },
            {
              label: "机构级",
              value: "机构级",
            },
            {
              label: "投契级",
              value: "投契级",
            },
          ].map((item) => {
            return (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      </Stack>
    </FormControl>
  );
}

// 层高
registerHouseFormComponent("floor_height", EditFloorHeight);
export function EditFloorHeight({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>层高</FormLabel>
      <Input
        placeholder="请输入"
        name="floor_height"
        type="number"
        endDecorator={<span>米</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 进深
registerHouseFormComponent("progress_depth", EditProgressDepth);
export function EditProgressDepth({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>进深</FormLabel>
      <Input
        placeholder="请输入"
        name="progress_depth"
        type="number"
        endDecorator={<span>米</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 门宽
registerHouseFormComponent("door_width", EditDoorWidth);
export function EditDoorWidth({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>门宽</FormLabel>
      <Input
        placeholder="请输入"
        name="door_width"
        type="number"
        endDecorator={<span>米</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 建筑面积
registerHouseFormComponent("building_area", EditBuildingArea);
export function EditBuildingArea({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>建筑面积</FormLabel>
      <Input
        placeholder="请输入"
        name="building_area"
        type="number"
        endDecorator={<span>M²</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 使用面积
registerHouseFormComponent("use_area", EditUseArea);
export function EditUseArea({ value, onChange }: FormChange<number>) {
  return (
    <FormControl>
      <FormLabel>使用面积</FormLabel>
      <Input
        placeholder="请输入"
        name="use_area"
        type="number"
        endDecorator={<span>M²</span>}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
      />
    </FormControl>
  );
}

// 房屋类型
registerHouseFormComponent("house_type", EditHouseType);
export function EditHouseType({
  value,
  onChange,
  purpose,
}: FormChange<string> & { sx?: SxProps }) {
  const options = useMemo(() => {
    if (isShowRelation([{ purpose: "仓库" }], { purpose })) {
      return [
        {
          label: "平房型仓库",
          value: "平房型仓库",
        },
        {
          label: "二层楼房型仓库",
          value: "二层楼房型仓库",
        },
        {
          label: "多层楼房型仓库",
          value: "多层楼房型仓库",
        },
        {
          label: "地下仓库",
          value: "地下仓库",
        },
        {
          label: "立体仓库",
          value: "立体仓库",
        },
      ];
    }

    if (isShowRelation([{ purpose: "厂房" }], { purpose })) {
      return [
        {
          label: "独立式",
          value: "独立式",
        },
        {
          label: "合租式",
          value: "合租式",
        },
        {
          label: "私宅式",
          value: "私宅式",
        },
        {
          label: "平房",
          value: "平房",
        },
        {
          label: "铁皮房",
          value: "铁皮房",
        },
      ];
    }

    if (isShowRelation([{ purpose: "商铺" }], { purpose })) {
      return [
        {
          label: "商业街商铺",
          value: "商业街商铺",
        },
        {
          label: "市场型商铺",
          value: "市场型商铺",
        },
        {
          label: "社区型商铺",
          value: "社区型商铺",
        },
        {
          label: "住宅底层商铺",
          value: "住宅底层商铺",
        },
        {
          label: "百货商场",
          value: "百货商场",
        },
        {
          label: "购物中心商铺",
          value: "购物中心商铺",
        },
        {
          label: "写字楼商铺",
          value: "写字楼商铺",
        },
        {
          label: "交通设施商铺",
          value: "交通设施商铺",
        },
      ];
    }

    if (isShowRelation([{ purpose: "写字楼" }], { purpose })) {
      return [
        {
          label: "单纯型写字楼",
          value: "单纯型写字楼",
        },
        {
          label: "商住型写字楼",
          value: "商住型写字楼",
        },
        {
          label: "综合型写字楼",
          value: "综合型写字楼",
        },
      ];
    }

    if (
      isShowRelation(
        [{ purpose: "住宅" }, { purpose: "别墅" }, { purpose: "公寓" }],
        { purpose }
      )
    ) {
      return [
        {
          label: "底层",
          value: "底层",
        },
        {
          label: "多层",
          value: "多层",
        },
        {
          label: "小高层",
          value: "小高层",
        },
        {
          label: "洋房",
          value: "洋房",
        },
        {
          label: "高层",
          value: "高层",
        },
        {
          label: "跃层式住宅",
          value: "跃层式住宅",
        },
        {
          label: "复式住宅",
          value: "复式住宅",
        },
        {
          label: "公寓住宅",
          value: "公寓住宅",
        },
        {
          label: "普通住宅",
          value: "普通住宅",
        },
        {
          label: "高档住宅",
          value: "高档住宅",
        },
        {
          label: "LOFT",
          value: "LOFT",
        },
        {
          label: "别墅",
          value: "别墅",
        },
        {
          label: "老式里弄",
          value: "老式里弄",
        },
        {
          label: "老式花园住宅",
          value: "老式花园住宅",
        },
        {
          label: "老式公寓",
          value: "老式公寓",
        },
      ];
    }

    return [];
  }, [purpose]);

  if (options.length === 0) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel>房屋类型</FormLabel>
      <Select
        name="house_type"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => {
          onChange(value!);
        }}
      >
        {options.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 朝向
registerHouseFormComponent("house_orientation", EditHouseOrientation);

export function EditHouseOrientation({
  value,
  onChange,
  purpose,
}: FormChange<string>) {
  const options = useMemo(() => {
    if (
      isShowRelation(
        [
          { purpose: "商铺" },
          { purpose: "写字楼" },
          { purpose: "住宅" },
          { purpose: "别墅" },
          { purpose: "公寓" },
        ],
        { purpose }
      )
    ) {
      return [
        {
          label: "东西",
          value: "东西",
        },
        {
          label: "南北",
          value: "南北",
        },
        {
          label: "东",
          value: "东",
        },
        {
          label: "南",
          value: "南",
        },
        {
          label: "西",
          value: "西",
        },
        {
          label: "北",
          value: "北",
        },
        {
          label: "金角",
          value: "金角",
        },
        {
          label: "银角",
          value: "银角",
        },
      ];
    }

    return [];
  }, [purpose]);

  if (options.length === 0) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel>朝向</FormLabel>
      <Select
        name="house_orientation"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {options.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 装修
registerHouseFormComponent("house_decoration", EditHouseDecoration);

export function EditHouseDecoration({
  value,
  onChange,
  purpose,
}: FormChange<string>) {
  const options = useMemo(() => {
    if (
      isShowRelation(
        [
          { purpose: "商铺" },
          { purpose: "写字楼" },
          { purpose: "住宅" },
          { purpose: "别墅" },
          { purpose: "公寓" },
        ],
        { purpose }
      )
    ) {
      return [
        {
          label: "毛坯",
          value: "毛坯",
        },
        {
          label: "简装",
          value: "简装",
        },
        {
          label: "精装",
          value: "精装",
        },
        {
          label: "豪装",
          value: "豪装",
        },
      ];
    }

    return [];
  }, [purpose]);

  if (options.length === 0) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel>装修</FormLabel>
      <Select
        name="house_decoration"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {options.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

registerHouseFormComponent("discount_year_limit", EditDiscountYearLimit);

export function EditDiscountYearLimit({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>满减年限</FormLabel>
      <Select
        name="discount_year_limit"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "1年",
            value: "1年",
          },
          {
            label: "2年",
            value: "2年",
          },
          {
            label: "3年",
            value: "3年",
          },
          {
            label: "4年",
            value: "4年",
          },
          {
            label: "5年",
            value: "5年",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 看房方式
registerHouseFormComponent("view_method", EditViewMethod);

export function EditViewMethod({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>看房方式</FormLabel>
      <Select
        name="view_method"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "提前预约",
            value: "提前预约",
          },
          {
            label: "直接带看",
            value: "直接带看",
          },
          {
            label: "借钥匙带看",
            value: "借钥匙带看",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 付款方式
registerHouseFormComponent("payment_method", EditPaymentMethod);

export function EditPaymentMethod({
  value,
  onChange,
  transaction_type,
}: FormChange<string>) {
  const options = useMemo(() => {
    const options: { label: string; value: string }[] = [];
    if (
      isShowRelation(
        [{ transaction_type: "出售" }, { transaction_type: "租售" }],
        { transaction_type }
      )
    ) {
      options.push(
        ...[
          {
            label: "一次性付款",
            value: "一次性付款",
          },
          {
            label: "分期付款",
            value: "分期付款",
          },
          {
            label: "银行按揭付款",
            value: "银行按揭付款",
          },
        ]
      );
    }

    if (isShowRelation([{ transaction_type: "出租" }], { transaction_type })) {
      options.push(
        ...[
          {
            label: "押一付三",
            value: "押一付三",
          },
          {
            label: "按月付",
            value: "按月付",
          },
          {
            label: "半年付",
            value: "半年付",
          },
          {
            label: "整年付",
            value: "整年付",
          },
        ]
      );
    }

    return options;
  }, [transaction_type]);

  return (
    <FormControl>
      <FormLabel>付款方式</FormLabel>
      <Select
        name="payment_method"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {options.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 房源税费
registerHouseFormComponent("property_tax", EditPropertyTax);

export function EditPropertyTax({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>房源税费</FormLabel>
      <Input
        name="property_tax"
        value={value}
        placeholder="请输入"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// 建筑结构
registerHouseFormComponent("building_structure", EditBuildingStructure);

export function EditBuildingStructure({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>建筑结构</FormLabel>
      <Select
        name="building_structure"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "板楼",
            value: "板楼",
          },
          {
            label: "框架",
            value: "框架",
          },
          {
            label: "砖混",
            value: "砖混",
          },
          {
            label: "砖木",
            value: "砖木",
          },
          {
            label: "钢混",
            value: "钢混",
          },
          {
            label: "钢木",
            value: "钢木",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 产权性质
registerHouseFormComponent("property_rights", EditPropertyRight);

export function EditPropertyRight({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>产权性质</FormLabel>

      <Select
        name="property_rights"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "商品房",
            value: "商品房",
          },
          {
            label: "公产房",
            value: "公产房",
          },
          {
            label: "私产房",
            value: "私产房",
          },
          {
            label: "经适房",
            value: "经适房",
          },
          {
            label: "企业房",
            value: "企业房",
          },
          {
            label: "军产房",
            value: "军产房",
          },
          {
            label: "安置房",
            value: "安置房",
          },
          {
            label: "小产权",
            value: "小产权",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 产权年限
registerHouseFormComponent("property_year_limit", EditPropertyYearLimit);

export function EditPropertyYearLimit({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>产权年限</FormLabel>

      <Select
        name="property_year_limit"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            ref: "用途",
            value: "写字楼",
          },
          {
            label: "70",
            value: "70",
          },
          {
            label: "50",
            value: "50",
          },
          {
            label: "40",
            value: "40",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 产证日期
registerHouseFormComponent("certificate_date", EditCertificateDate);

export function EditCertificateDate({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>产证日期</FormLabel>
      <Input
        type="date"
        name="certificate_date"
        value={value}
        placeholder="请输入"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// 交房日期
registerHouseFormComponent("handover_date", EditHandoverDate);

export function EditHandoverDate({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>交房日期</FormLabel>
      <Input
        type="date"
        name="handover_date"
        value={value}
        placeholder="请输入"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// 学位
registerHouseFormComponent("degree", EditDegree);

export function EditDegree({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>学位</FormLabel>
      <Input
        type="text"
        name="degree"
        value={value}
        placeholder="请输入"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// 户口
registerHouseFormComponent("household", EditHousehold);

export function EditHousehold({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>户口</FormLabel>

      <Select
        name="household"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "集体户口可买",
            value: "集体户口可买",
          },
          {
            label: "业主可协助过户",
            value: "业主可协助过户",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 来源
registerHouseFormComponent("source", EditSource);

export function EditSource({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>来源</FormLabel>

      <Select
        name="source"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "上门",
            value: "上门",
          },
          {
            label: "电话",
            value: "电话",
          },
          {
            label: "陌拜",
            value: "陌拜",
          },
          {
            label: "驻守",
            value: "驻守",
          },
          {
            label: "窗体广告",
            value: "窗体广告",
          },
          {
            label: "搜房",
            value: "搜房",
          },
          {
            label: "新浪乐居",
            value: "新浪乐居",
          },
          {
            label: "58",
            value: "58",
          },
          {
            label: "赶集",
            value: "赶集",
          },
          {
            label: "已成交客户推荐",
            value: "已成交客户推荐",
          },
          {
            label: "公司网站",
            value: "公司网站",
          },
          {
            label: "朋友介绍",
            value: "朋友介绍",
          },
          {
            label: "老客户",
            value: "老客户",
          },
          {
            label: "派单",
            value: "派单",
          },
          {
            label: "微博",
            value: "微博",
          },
          {
            label: "微店",
            value: "微店",
          },
          {
            label: "微信公众账号",
            value: "微信公众账号",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 唯一住房
registerHouseFormComponent("unique_housing", EditUniqueHousing);

export function EditUniqueHousing({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>唯一住房</FormLabel>

      <Select
        name="unique_housing"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "是",
            value: "是",
          },
          {
            label: "否",
            value: "否",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 是否全款
registerHouseFormComponent("full_payment", EditFullPayment);

export function EditFullPayment({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>全款</FormLabel>

      <Select
        name="full_payment"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "是",
            value: "是",
          },
          {
            label: "否",
            value: "否",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 是否有抵押
registerHouseFormComponent("mortgage", EditMortgage);

export function EditMortgage({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>抵押</FormLabel>
      <Select
        name="mortgage"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "是",
            value: "是",
          },
          {
            label: "否",
            value: "否",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 急切
registerHouseFormComponent("urgent", EditUrgent);

export function EditUrgent({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>急切</FormLabel>
      <Select
        name="urgent"
        placeholder="请输入"
        value={value}
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "是",
            value: "是",
          },
          {
            label: "否",
            value: "否",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 配套
registerHouseFormComponent("support", EditSupport);

export function EditSupport({ value, onChange, purpose }: FormChange<string>) {
  const options = useMemo(() => {
    if (isShowRelation([{ purpose: "仓库" }], { purpose })) {
      return [
        {
          label: "水",
          value: "水",
        },
        {
          label: "电",
          value: "电",
        },
        {
          label: "通风",
          value: "通风",
        },
      ];
    }

    if (isShowRelation([{ purpose: "商铺" }], { purpose })) {
      return [
        {
          label: "自来水",
          value: "自来水",
        },
        {
          label: "空调",
          value: "空调",
        },
        {
          label: "电",
          value: "电",
        },
        {
          label: "宽带",
          value: "宽带",
        },
        {
          label: "煤气",
          value: "煤气",
        },
        {
          label: "车位",
          value: "车位",
        },
        {
          label: "银行",
          value: "银行",
        },
      ];
    }

    if (isShowRelation([{ purpose: "写字楼" }], { purpose })) {
      return [
        {
          label: "会议室",
          value: "会议室",
        },
        {
          label: "银行",
          value: "银行",
        },
        {
          label: "停车场",
          value: "停车场",
        },
        {
          label: "便利店",
          value: "便利店",
        },
        {
          label: "活动场",
          value: "活动场",
        },
        {
          label: "休息场",
          value: "休息场",
        },
        {
          label: "图书馆",
          value: "图书馆",
        },
        {
          label: "电梯系统",
          value: "电梯系统",
        },
      ];
    }

    if (
      isShowRelation(
        [{ purpose: "住宅" }, { purpose: "别墅" }, { purpose: "公寓" }],
        { purpose }
      )
    ) {
      return [
        {
          label: "床",
          value: "床",
        },
        {
          label: "衣柜",
          value: "衣柜",
        },
        {
          label: "书桌",
          value: "书桌",
        },
        {
          label: "空调",
          value: "空调",
        },
        {
          label: "冰箱",
          value: "冰箱",
        },
        {
          label: "电视",
          value: "电视",
        },
        {
          label: "洗衣机",
          value: "洗衣机",
        },
        {
          label: "宽带",
          value: "宽带",
        },
        {
          label: "WIFI",
          value: "WIFI",
        },
        {
          label: "油烟机",
          value: "油烟机",
        },
        {
          label: "燃气灶",
          value: "燃气灶",
        },
        {
          label: "电热水器",
          value: "电热水器",
        },
      ];
    }

    return [];
  }, [purpose]);

  if (options.length === 0) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel>配套</FormLabel>
      <Select
        multiple
        placeholder="请输入"
        name="support"
        value={value?.split(",")}
        onChange={(_, value) => onChange(value.join(","))}
      >
        {options.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 现状
registerHouseFormComponent("present_state", EditPresentState);

export function EditPresentState({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>现状</FormLabel>
      <Select
        name="present_state"
        value={value}
        placeholder="请输入"
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "空置",
            value: "空置",
          },
          {
            label: "在用",
            value: "在用",
          },
          {
            label: "全新",
            value: "全新",
          },
          {
            ref: "用途",
            value: "别墅",
          },
          {
            ref: "用途",
            value: "公寓",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 外网同步
registerHouseFormComponent("external_sync", EditExternalSync);

export function EditExternalSync({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>外网同步</FormLabel>
      <Select
        name="external_sync"
        placeholder="请输入"
        value={value}
        onChange={(_, value) => onChange(value!)}
      >
        {[
          {
            label: "是",
            value: "是",
          },
          {
            label: "否",
            value: "否",
          },
        ].map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </FormControl>
  );
}

// 备注
registerHouseFormComponent("remark", EditRemark);

export function EditRemark({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>备注</FormLabel>
      <Textarea
        placeholder="请输入"
        name="remark"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

// images
registerHouseFormComponent("images", EditImages);

export function EditImages({
  value,
  onChange,
  community_name,
}: FormChange<FileInfo[]>) {
  return (
    <DropZone directory={community_name} value={value} onChange={onChange} />
  );
}

// 建筑年代
registerHouseFormComponent("building_year", EditBuildingYear);

export function EditBuildingYear({ value, onChange }: FormChange<string>) {
  return (
    <FormControl>
      <FormLabel>建筑年代</FormLabel>
      <Input
        placeholder="请输入"
        name="building_year"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}
