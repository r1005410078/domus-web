"use client";

import {
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack,
  Button,
  Textarea,
  Tabs,
  TabList,
  Tab,
  tabClasses,
  TabPanel,
} from "@mui/joy";
import React, { use, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { HouseForm } from "@/models/house";
import { CommunityForm, HouseOwnerForm } from "./common";
import DropZone from "./DropZone";
import { useSaveHouse } from "@/hooks/useHouse";

export interface Relation {
  purpose?: string;
  transaction_type?: string;
}

interface FormProps {
  defaultValues?: HouseForm;
  value?: HouseForm;
}

export function Form({ defaultValues, value }: FormProps) {
  const { mutate } = useSaveHouse();
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  const { purpose, transaction_type, community_name } = useStore(
    form.store,
    (state) => {
      return {
        purpose: state.values.purpose,
        transaction_type: state.values.transaction_type,
        community_name: state.values.community?.name,
      };
    }
  );

  const isShowRelation = (compare: Relation[]) => {
    return compare.some((item) => {
      let isHas = true;
      if (item.purpose) {
        isHas = item.purpose === purpose;
      }

      if (item.transaction_type && isHas) {
        isHas = item.transaction_type === transaction_type;
      }

      return isHas;
    });
  };

  useEffect(() => {
    if (value) {
      form.reset(value);
    }
  }, [value]);

  return (
    <Card
      sx={{
        width: "430px",
        background: "background.surface",
        height: "100%",
        borderRadius: 0,
        border: 0,
        p: 1,
      }}
    >
      <Tabs aria-label="tabs" defaultValue={0} sx={{ p: 0, overflowY: "auto" }}>
        <TabList
          disableUnderline
          tabFlex={1}
          sticky={"top"}
          variant="soft"
          underlinePlacement={"top"}
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: "xl",
            bgcolor: "background.level1",
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "sm",
              bgcolor: "background.surface",
            },
          }}
        >
          <Tab
            disableIndicator
            variant="soft"
            sx={{ flexGrow: 1 }}
            indicatorPlacement={"top"}
          >
            基础
          </Tab>
          <Tab
            disableIndicator
            variant="soft"
            sx={{ flexGrow: 1 }}
            indicatorPlacement={"top"}
          >
            详细
          </Tab>
          <Tab
            disableIndicator
            variant="soft"
            sx={{ flexGrow: 1 }}
            indicatorPlacement={"top"}
          >
            图片
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <Stack direction="column" spacing={2}>
            <form.Field
              name="purpose"
              children={(field) => {
                return (
                  <FormControl required sx={{ gridColumn: "span 2" }}>
                    <FormLabel>用途</FormLabel>
                    <Select
                      placeholder="请输入"
                      name="purpose"
                      value={field.state.value}
                      onChange={(_, value) => {
                        field.handleChange(value as string);
                      }}
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
              }}
            />

            <form.Field
              name="transaction_type"
              children={(field) => {
                return (
                  <FormControl required sx={{ gridColumn: "span 2" }}>
                    <FormLabel>交易类型</FormLabel>
                    <Select
                      placeholder="请输入"
                      name="transaction_type"
                      value={field.state.value}
                      onChange={(_, value) => {
                        field.handleChange(value as string);
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
              }}
            />

            <form.Field
              name="house_status"
              children={(field) => {
                return (
                  <FormControl sx={{ gridColumn: "span 2" }} required>
                    <FormLabel>状态</FormLabel>
                    <Select
                      value={field.state.value}
                      placeholder="请选择"
                      name="house_status"
                      onChange={(_, value) => field.handleChange(value!)}
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
              }}
            />

            <form.Field
              name="owner"
              children={(field) => {
                return (
                  <HouseOwnerForm
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                );
              }}
            />

            {isShowRelation([
              { transaction_type: "出售" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="sale_price"
                children={(field) => {
                  return (
                    <FormControl required>
                      <FormLabel>售价</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="sale_price"
                        type="number"
                        endDecorator={<span>万元</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([
              { transaction_type: "出售" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="sale_low_price"
                children={(field) => {
                  return (
                    <FormControl required>
                      <FormLabel>出售低价</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="sale_low_price"
                        type="number"
                        endDecorator={<span>万元</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([
              { transaction_type: "出租" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="rent_price"
                children={(field) => {
                  return (
                    <FormControl required>
                      <FormLabel>租价</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="rent_price"
                        type="number"
                        endDecorator={<span>元/月</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([
              { transaction_type: "出租" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="rent_price"
                children={(field) => {
                  return (
                    <FormControl required>
                      <FormLabel>出租低价</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="rent_price"
                        type="number"
                        endDecorator={<span>元</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([
              { transaction_type: "出售" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="down_payment"
                children={(field) => {
                  return (
                    <FormControl required>
                      <FormLabel>首付</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="down_payment"
                        type="number"
                        endDecorator={<span>%</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            <form.Field
              name="community"
              children={(field) => {
                return (
                  <FormControl required>
                    <FormLabel>小区</FormLabel>
                    <CommunityForm
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  </FormControl>
                );
              }}
            />

            <form.Field
              name="door_number"
              children={(field) => {
                return (
                  <FormControl required>
                    <FormLabel>门牌号</FormLabel>
                    <Stack
                      direction="row"
                      spacing={2}
                      useFlexGap
                      sx={{ flexWrap: "wrap" }}
                    >
                      <Stack spacing={1} direction="row">
                        <FormControl>
                          <Input
                            style={{ width: "150px" }}
                            placeholder="请输入"
                            value={field.state.value?.building_number}
                            type="number"
                            onChange={(e) =>
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
                                building_number: Number(e.target.value),
                              })
                            }
                            endDecorator={<span>栋</span>}
                          />
                        </FormControl>
                        <Divider orientation="vertical" />
                        <FormControl>
                          <Input
                            style={{ width: "150px" }}
                            placeholder="请输入"
                            type="number"
                            value={field.state.value?.unit_number}
                            onChange={(e) =>
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
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
                          value={field.state.value?.door_number}
                          name="door_number"
                          onChange={(e) =>
                            field.handleChange({
                              ...((field.state.value ?? {}) as any),
                              door_number: Number(e.target.value),
                            })
                          }
                          endDecorator={<span>门牌号</span>}
                        />
                      </FormControl>
                    </Stack>
                  </FormControl>
                );
              }}
            />

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="apartment_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>户型</FormLabel>
                      <Stack
                        spacing={1}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: "wrap" }}
                      >
                        <FormControl style={{ width: 115 }}>
                          <Input
                            placeholder="请输入"
                            name="room"
                            type="number"
                            value={field.state.value?.room}
                            onChange={(e) =>
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
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
                            value={field.state.value?.hall}
                            onChange={(e) =>
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
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
                            value={field.state.value?.bathroom}
                            onChange={(e) => {
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
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
                            value={field.state.value?.kitchen}
                            onChange={(e) => {
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
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
                            value={field.state.value?.balcony}
                            onChange={(e) => {
                              field.handleChange({
                                ...((field.state.value ?? {}) as any),
                                balcony: Number(e.target.value),
                              });
                            }}
                            endDecorator={<span>阳台</span>}
                          />
                        </FormControl>
                      </Stack>
                    </FormControl>
                  );
                }}
              />
            )}
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ mt: 2 }}
            spacing={2}
          >
            <Button variant="outlined" color="neutral">
              重置
            </Button>
            <Button variant="solid" onClick={handleSubmit}>
              保存
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={1}>
          <Stack direction="column" spacing={2}>
            <form.Field
              name="title"
              children={(field) => {
                return (
                  <FormControl>
                    <FormLabel>房源标题</FormLabel>
                    <Input
                      placeholder="请输入"
                      name="title"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                );
              }}
            />

            <form.Field
              name="floor_range"
              children={(field) => {
                return (
                  <FormControl>
                    <FormLabel>楼层</FormLabel>
                    <Stack
                      direction="row"
                      spacing={2}
                      useFlexGap
                      sx={{ flexWrap: "wrap" }}
                    >
                      <FormControl>
                        <Input
                          style={{ width: "100px" }}
                          placeholder="请输入"
                          name="door_number_from"
                          type="number"
                          value={field.state.value?.door_number_from}
                          onChange={(e) => {
                            field.handleChange({
                              ...((field.state.value ?? {}) as any),
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
                          value={field.state.value?.door_number_to}
                          onChange={(e) =>
                            field.handleChange({
                              ...((field.state.value ?? {}) as any),
                              door_number_to: Number(e.target.value),
                            })
                          }
                        />
                      </FormControl>
                      <Divider orientation="vertical">楼</Divider>
                    </Stack>
                  </FormControl>
                );
              }}
            />

            <form.Field
              name="tags"
              children={(field) => {
                return (
                  <FormControl>
                    <FormLabel>推荐标签</FormLabel>
                    <Select
                      multiple
                      placeholder="请输入"
                      name="tags"
                      value={field.state.value}
                      onChange={(e, value) =>
                        field.handleChange(value as string[])
                      }
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
              }}
            />

            {isShowRelation([{ purpose: "车位" }]) && (
              <form.Field
                name="car_height"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>车位高度</FormLabel>
                      <Input
                        placeholder="请输入"
                        type="number"
                        name="car_height"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
              { purpose: "写字楼" },
            ]) && (
              <form.Field
                name="stairs"
                children={(field) => {
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
                            value={field.state.value?.stairs}
                            onChange={(e) => {
                              field.handleChange({
                                ...field.state.value,
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
                            value={field.state.value?.rooms}
                            onChange={(e) => {
                              field.handleChange({
                                ...field.state.value,
                                rooms: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Stack>
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([{ purpose: "仓库" }, { purpose: "写字楼" }]) && (
              <form.Field
                name="actual_rate"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>实率</FormLabel>
                      <Stack spacing={1} direction="row" useFlexGap>
                        <Input
                          placeholder="请输入"
                          name="actual_rate"
                          type="number"
                          endDecorator={<span>%</span>}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(Number(e.target.value));
                          }}
                        />
                      </Stack>
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([{ purpose: "写字楼" }]) && (
              <form.Field
                name="level"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>级别</FormLabel>
                      <Stack spacing={1} direction="row" useFlexGap>
                        <Select
                          placeholder="请选择"
                          name="level"
                          value={field.state.value}
                          onChange={(e, value) => {
                            field.handleChange(value!);
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
                }}
              />
            )}

            {isShowRelation([
              { purpose: "厂房" },
              { purpose: "商铺" },
              { purpose: "写字楼" },
            ]) && (
              <form.Field
                name="floor_height"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>层高</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="floor_height"
                        type="number"
                        value={field.state.value}
                        endDecorator={<span>米</span>}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([{ purpose: "商铺" }]) && (
              <form.Field
                name="progress_depth"
                children={(field) => (
                  <FormControl>
                    <FormLabel>进深</FormLabel>
                    <Input
                      placeholder="请输入"
                      name="progress_depth"
                      type="number"
                      endDecorator={<span>米</span>}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                )}
              />
            )}

            {isShowRelation([{ purpose: "商铺" }]) && (
              <form.Field
                name="door_width"
                children={(field) => (
                  <FormControl>
                    <FormLabel>门宽</FormLabel>
                    <Input
                      placeholder="请输入"
                      name="door_width"
                      type="number"
                      endDecorator={<span>米</span>}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                )}
              />
            )}

            <form.Field
              name="building_area"
              children={(field) => (
                <FormControl>
                  <FormLabel>建筑面积</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="building_area"
                    type="number"
                    endDecorator={<span>平米</span>}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(Number(e.target.value));
                    }}
                  />
                </FormControl>
              )}
            />

            {isShowRelation([
              { purpose: "写字楼" },
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="use_area"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>使用面积</FormLabel>
                      <Input
                        placeholder="请输入"
                        name="use_area"
                        type="number"
                        endDecorator={<span>平米</span>}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                  );
                }}
              />
            )}

            {isShowRelation([{ purpose: "车位" }]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => {
                          field.handleChange(value!);
                        }}
                      >
                        {[
                          {
                            label: "地面停车位",
                            value: "地面停车位",
                          },
                          {
                            label: "独立车库停车位",
                            value: "独立车库停车位",
                          },
                          {
                            label: "地下车库停车位",
                            value: "地下车库停车位",
                          },
                          {
                            label: "机械立体停车位",
                            value: "机械立体停车位",
                          },
                          {
                            label: "停车楼车位",
                            value: "停车楼车位",
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
                }}
              />
            )}

            {isShowRelation([{ purpose: "仓库" }]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([{ purpose: "厂房" }]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([{ purpose: "商铺" }]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([{ purpose: "写字楼" }]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="house_type"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>房屋类型</FormLabel>
                      <Select
                        name="house_type"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([
              { purpose: "商铺" },
              { purpose: "写字楼" },
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="house_decoration"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>朝向</FormLabel>
                      <Select
                        name="house_orientation"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([
              { purpose: "商铺" },
              { purpose: "写字楼" },
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="house_decoration"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>装修</FormLabel>
                      <Select
                        name="house_decoration"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([
              { purpose: "车位" },
              { purpose: "仓库" },
              { purpose: "厂房" },
              { purpose: "商铺" },
              { purpose: "公寓" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="discount_year_limit"
                children={(field) => (
                  <FormControl>
                    <FormLabel>满减年限</FormLabel>
                    <Select
                      name="discount_year_limit"
                      value={field.state.value}
                      placeholder="请输入"
                      onChange={(_, value) => field.handleChange(value!)}
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
                )}
              />
            )}

            {isShowRelation([
              { purpose: "车位" },
              { purpose: "仓库" },
              { purpose: "厂房" },
              { purpose: "商铺" },
              { purpose: "写字楼" },
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="view_method"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>看房方式</FormLabel>
                      <Select
                        name="view_method"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
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
                }}
              />
            )}

            {isShowRelation([
              { transaction_type: "出售" },
              { transaction_type: "租售" },
            ]) && (
              <form.Field
                name="payment_method"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>付款方式</FormLabel>
                      <Select
                        name="payment_method"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}

            {isShowRelation([{ transaction_type: "交易类型" }]) && (
              <form.Field
                name="payment_method"
                children={(field) => {
                  return (
                    <FormControl>
                      <FormLabel>付款方式</FormLabel>
                      <Select
                        name="payment_method"
                        value={field.state.value}
                        placeholder="请输入"
                        onChange={(_, value) => field.handleChange(value!)}
                      >
                        {[
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
                }}
              />
            )}
            <form.Field
              name="property_tax"
              children={(field) => (
                <FormControl>
                  <FormLabel>房源税费</FormLabel>

                  <Input
                    name="property_tax"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
              )}
            />

            <form.Field
              name="building_structure"
              children={(field) => (
                <FormControl>
                  <FormLabel>建筑结构</FormLabel>

                  <Select
                    name="building_structure"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="property_rights"
              children={(field) => (
                <FormControl>
                  <FormLabel>产权性质</FormLabel>

                  <Select
                    name="property_rights"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="property_year_limit"
              children={(field) => (
                <FormControl>
                  <FormLabel>产权年限</FormLabel>

                  <Select
                    name="property_year_limit"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="certificate_date"
              children={(field) => (
                <FormControl>
                  <FormLabel>产证日期</FormLabel>

                  <Input
                    type="date"
                    name="certificate_date"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
              )}
            />

            <form.Field
              name="handover_date"
              children={(field) => (
                <FormControl>
                  <FormLabel>交房日期</FormLabel>

                  <Input
                    type="date"
                    name="handover_date"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
              )}
            />

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="degree"
                children={(field) => (
                  <FormControl>
                    <FormLabel>学位</FormLabel>

                    <Input
                      name="degree"
                      placeholder="请输入"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormControl>
                )}
              />
            )}

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="household"
                children={(field) => (
                  <FormControl>
                    <FormLabel>户口</FormLabel>

                    <Select
                      name="household"
                      value={field.state.value}
                      placeholder="请输入"
                      onChange={(_, value) => field.handleChange(value!)}
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
                )}
              />
            )}

            <form.Field
              name="source"
              children={(field) => (
                <FormControl>
                  <FormLabel>来源</FormLabel>

                  <Select
                    name="source"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="unique_housing"
              children={(field) => (
                <FormControl>
                  <FormLabel>唯一住房</FormLabel>

                  <Select
                    name="unique_housing"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="full_payment"
              children={(field) => (
                <FormControl>
                  <FormLabel>全款</FormLabel>

                  <Select
                    name="full_payment"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="mortgage"
              children={(field) => (
                <FormControl>
                  <FormLabel>抵押</FormLabel>
                  <Select
                    name="mortgage"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="urgent"
              children={(field) => (
                <FormControl>
                  <FormLabel>急切</FormLabel>
                  <Select
                    name="urgent"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            {isShowRelation([{ purpose: "仓库" }]) && (
              <form.Field
                name="support"
                children={(field) => (
                  <FormControl>
                    <FormLabel>配套</FormLabel>
                    <Select
                      multiple
                      placeholder="请输入"
                      name="support"
                      value={field.state.value?.split(",")}
                      onChange={(_, value) =>
                        field.handleChange(value.join(","))
                      }
                    >
                      {[
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
                      ].map((item) => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            {isShowRelation([{ purpose: "商铺" }]) && (
              <form.Field
                name="support"
                children={(field) => (
                  <FormControl>
                    <FormLabel>配套</FormLabel>
                    <Select
                      multiple
                      placeholder="请输入"
                      name="support"
                      value={field.state.value?.split(",")}
                      onChange={(_, value) =>
                        field.handleChange(value.join(","))
                      }
                    >
                      {[
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
                      ].map((item) => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            {isShowRelation([{ purpose: "写字楼" }]) && (
              <form.Field
                name="support"
                children={(field) => (
                  <FormControl>
                    <FormLabel>配套</FormLabel>
                    <Select
                      multiple
                      name="support"
                      placeholder="请输入"
                      value={field.state.value?.split(",")}
                      onChange={(_, value) =>
                        field.handleChange(value.join(","))
                      }
                    >
                      {[
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
                      ].map((item) => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            {isShowRelation([
              { purpose: "住宅" },
              { purpose: "别墅" },
              { purpose: "公寓" },
            ]) && (
              <form.Field
                name="support"
                children={(field) => (
                  <FormControl>
                    <FormLabel>配套</FormLabel>
                    <Select
                      multiple
                      name="support"
                      placeholder="请输入"
                      value={field.state.value?.split(",")}
                      onChange={(_, value) =>
                        field.handleChange(value.join(","))
                      }
                    >
                      {[
                        {
                          ref: "用途",
                          value: "厂房",
                        },
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
                      ].map((item) => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            <form.Field
              name="remark"
              children={(field) => (
                <FormControl>
                  <FormLabel>现状</FormLabel>
                  <Select
                    name="present_state"
                    value={field.state.value}
                    placeholder="请输入"
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="external_sync"
              children={(field) => (
                <FormControl>
                  <FormLabel>外网同步</FormLabel>
                  <Select
                    name="external_sync"
                    placeholder="请输入"
                    value={field.state.value}
                    onChange={(_, value) => field.handleChange(value!)}
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
              )}
            />

            <form.Field
              name="remark"
              children={(field) => (
                <FormControl>
                  <FormLabel>备注</FormLabel>
                  <Textarea
                    placeholder="请输入"
                    name="remark"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
              )}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ mt: 2 }}
            spacing={2}
          >
            <Button variant="outlined" color="neutral">
              重置
            </Button>
            <Button variant="solid" onClick={handleSubmit}>
              保存
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={2}>
          <form.Field
            name="images"
            children={(field) => (
              <DropZone
                directory={community_name}
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />
        </TabPanel>
      </Tabs>
    </Card>
  );
}
