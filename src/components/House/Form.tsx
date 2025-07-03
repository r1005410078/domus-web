"use client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Typography,
  Option,
  Stack,
  CardOverflow,
  CardActions,
  Button,
  Autocomplete,
  Textarea,
} from "@mui/joy";
import { useState } from "react";
import { CommunitySelect } from "../CommunitySelect";

interface Relation {
  purpose?: string;
  transaction_type?: string;
}

export function Form() {
  const [relation, setRelation] = useState<Relation>({});

  const isShowRelation = (compare: Relation[]) => {
    return compare.some((item) => {
      return (
        item.purpose === relation.purpose &&
        item.transaction_type === relation.transaction_type
      );
    });
  };

  return (
    <Box
      sx={{
        width: "430px",
        background: "background.surface",
        height: "100%",
      }}
    >
      <Card
        variant="soft"
        sx={{
          maxHeight: "max-content",
          maxWidth: "100%",
          mx: "auto",
          // to make the demo resizable
          overflow: "auto",
        }}
      >
        <Typography level="title-lg" startDecorator={<InfoOutlined />}>
          新增房源
        </Typography>
        <Divider inset="none" />
        <CardContent>
          <form onSubmit={(event) => {}}>
            <Stack direction="column" spacing={2}>
              <FormControl required sx={{ gridColumn: "span 2" }}>
                <FormLabel>用途</FormLabel>
                <Select
                  placeholder="用途"
                  name="purpose"
                  onChange={(_, value) => {
                    setRelation({
                      ...relation,
                      purpose: value as string,
                    });
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

              <FormControl required sx={{ gridColumn: "span 2" }}>
                <FormLabel>交易类型</FormLabel>
                <Select
                  placeholder="交易类型"
                  name="transaction_type"
                  onChange={(_, value) => {
                    setRelation({
                      ...relation,
                      transaction_type: value as string,
                    });
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

              <FormControl sx={{ gridColumn: "span 2" }}>
                <FormLabel>交易类型</FormLabel>
                <Select placeholder="交易类型" name="transaction_type">
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

              <FormControl required sx={{ gridColumn: "span 2" }}>
                <FormLabel>业主姓名</FormLabel>
                <Input
                  placeholder="业主姓名"
                  name="owner_name"
                  endDecorator={
                    <>
                      <Divider orientation="vertical" />
                      <FormControl>
                        <Select
                          variant="plain"
                          defaultValue={"本人"}
                          onChange={(_, value) => {}}
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
                          {ownerNameOptions.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </>
                  }
                  sx={{ width: 300 }}
                />
              </FormControl>

              <FormControl required sx={{ gridColumn: "span 2" }}>
                <FormLabel>联系电话</FormLabel>
                <Input
                  placeholder="联系电话"
                  endDecorator={
                    <>
                      <Divider orientation="vertical" />
                      <FormControl required>
                        <Select
                          variant="plain"
                          defaultValue={"本人"}
                          onChange={(_, value) => {}}
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
                          {ownerNameOptions.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </>
                  }
                  sx={{ width: 300 }}
                />
              </FormControl>
              {/* 使用高德地图 */}
              <FormControl required>
                <FormLabel>小区</FormLabel>
                <CommunitySelect />
              </FormControl>

              <Divider inset="none" />

              <FormControl>
                <FormLabel>楼层</FormLabel>
                <Stack direction="row" spacing={2}>
                  <FormControl>
                    <Input placeholder="请输入" name="door_number_from" />
                  </FormControl>
                  <Divider orientation="vertical">到</Divider>
                  <FormControl>
                    <Input placeholder="请输入" name="door_number_to" />
                  </FormControl>
                  <Divider orientation="vertical">楼</Divider>
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>门牌号</FormLabel>
                <Stack direction="row" spacing={2}>
                  <FormControl>
                    <Input placeholder="座栋" name="building_number" />
                  </FormControl>
                  <Divider orientation="vertical" />
                  <FormControl>
                    <Input placeholder="单元" name="unit_number" />
                  </FormControl>
                  <Divider orientation="vertical" />
                  <FormControl>
                    <Input placeholder="门牌号" name="door_number" />
                  </FormControl>
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>房源标题</FormLabel>
                <Input placeholder="房源标题" name="title" />
              </FormControl>

              <FormControl>
                <FormLabel>推荐标签</FormLabel>
                <Select multiple placeholder="推荐标签" name="tags">
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

              {isShowRelation([{ purpose: "车位" }]) && (
                <FormControl>
                  <FormLabel>车位高度</FormLabel>
                  <Input
                    placeholder="车位高度"
                    type="number"
                    name="car_height"
                  />
                </FormControl>
              )}

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
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
                        endDecorator={<span>室</span>}
                      />
                    </FormControl>

                    <FormControl style={{ width: 115 }}>
                      <Input
                        placeholder="请输入"
                        name="hall"
                        type="number"
                        endDecorator={<span>厅</span>}
                      />
                    </FormControl>

                    <FormControl style={{ width: 115 }}>
                      <Input
                        placeholder="请输入"
                        name="bathroom"
                        type="number"
                        endDecorator={<span>卫</span>}
                      />
                    </FormControl>
                    <FormControl style={{ width: 115 }}>
                      <Input
                        placeholder="请输入"
                        name="bathroom"
                        type="number"
                        endDecorator={<span>厨</span>}
                      />
                    </FormControl>
                    <FormControl style={{ width: 130 }}>
                      <Input
                        placeholder="请输入"
                        name="balcony"
                        type="number"
                        endDecorator={<span>阳台</span>}
                      />
                    </FormControl>
                  </Stack>
                </FormControl>
              )}

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
                { purpose: "写字楼" },
              ]) && (
                <FormControl>
                  <FormLabel>梯户</FormLabel>
                  <Stack spacing={1} direction="row" useFlexGap>
                    <FormControl>
                      <Input
                        placeholder="请输入"
                        name="stairs"
                        type="number"
                        endDecorator={<span>梯</span>}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        placeholder="请输入"
                        name="rooms"
                        type="number"
                        endDecorator={<span>户</span>}
                      />
                    </FormControl>
                  </Stack>
                </FormControl>
              )}

              {isShowRelation([{ purpose: "仓库" }, { purpose: "写字楼" }]) && (
                <FormControl>
                  <FormLabel>实率</FormLabel>
                  <Stack spacing={1} direction="row" useFlexGap>
                    <Input
                      placeholder="请输入"
                      name="actual_rate"
                      type="number"
                      endDecorator={<span>%</span>}
                    />
                  </Stack>
                </FormControl>
              )}

              {isShowRelation([{ purpose: "写字楼" }]) && (
                <FormControl>
                  <FormLabel>级别</FormLabel>
                  <Stack spacing={1} direction="row" useFlexGap>
                    <Select
                      placeholder="请选择"
                      name="level"
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
              )}

              {isShowRelation([
                { purpose: "厂房" },
                { purpose: "商铺" },
                { purpose: "写字楼" },
              ]) && (
                <FormControl>
                  <FormLabel>层高</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="floor_height"
                    type="number"
                    endDecorator={<span>米</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ purpose: "商铺" }]) && (
                <FormControl>
                  <FormLabel>进深</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="progress_depth"
                    type="number"
                    endDecorator={<span>米</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ purpose: "商铺" }]) && (
                <FormControl>
                  <FormLabel>门宽</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="door_width"
                    type="number"
                    endDecorator={<span>米</span>}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>建筑面积</FormLabel>
                <Input
                  placeholder="请输入"
                  name="building_area"
                  type="number"
                  endDecorator={<span>平米</span>}
                />
              </FormControl>

              {isShowRelation([
                { purpose: "写字楼" },
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl>
                  <FormLabel>使用面积</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="use_area"
                    type="number"
                    endDecorator={<span>平米</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ transaction_type: "出售" }]) && (
                <FormControl required>
                  <FormLabel>售价</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="sale_price"
                    type="number"
                    endDecorator={<span>万元</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ transaction_type: "出租" }]) && (
                <FormControl required>
                  <FormLabel>租价</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="rent_price"
                    type="number"
                    endDecorator={<span>元/月</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ transaction_type: "出租" }]) && (
                <FormControl required>
                  <FormLabel>出租低价</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="rent_price"
                    type="number"
                    endDecorator={<span>元</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ transaction_type: "出售" }]) && (
                <FormControl required>
                  <FormLabel>首付</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="down_payment"
                    type="number"
                    endDecorator={<span>%</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ transaction_type: "出售" }]) && (
                <FormControl required>
                  <FormLabel>出售低价</FormLabel>
                  <Input
                    placeholder="请输入"
                    name="sale_low_price"
                    type="number"
                    endDecorator={<span>万元</span>}
                  />
                </FormControl>
              )}

              {isShowRelation([{ purpose: "车位" }]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([{ purpose: "仓库" }]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([{ purpose: "厂房" }]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([{ purpose: "商铺" }]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([{ purpose: "写字楼" }]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>房屋类型</FormLabel>
                  <Select name="house_type">
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
              )}

              {isShowRelation([
                { purpose: "商铺" },
                { purpose: "写字楼" },
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>朝向</FormLabel>
                  <Select name="house_orientation">
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
              )}

              {isShowRelation([
                { purpose: "商铺" },
                { purpose: "写字楼" },
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>装修</FormLabel>
                  <Select name="house_decoration">
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
                <FormControl required>
                  <FormLabel>满减年限</FormLabel>
                  <Select name="discount_year_limit">
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
                <FormControl required>
                  <FormLabel>看房方式</FormLabel>
                  <Select name="view_method">
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
              )}

              {isShowRelation([{ transaction_type: "出售" }]) && (
                <FormControl required>
                  <FormLabel>付款方式</FormLabel>
                  <Select name="payment_method">
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
              )}

              {isShowRelation([{ transaction_type: "交易类型" }]) && (
                <FormControl required>
                  <FormLabel>付款方式</FormLabel>
                  <Select name="payment_method">
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
              )}

              <FormControl required>
                <FormLabel>房源税费</FormLabel>
                <Input name="property_tax" placeholder="请输入" />
              </FormControl>

              <FormControl>
                <FormLabel>建筑结构</FormLabel>
                <Select name="building_structure">
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

              <FormControl>
                <FormLabel>产权性质</FormLabel>
                <Select name="property_rights">
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

              <FormControl>
                <FormLabel>产权年限</FormLabel>
                <Select name="property_year_limit">
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

              <FormControl>
                <FormLabel>产证日期</FormLabel>
                <Input type="date" name="certificate_date" />
              </FormControl>

              <FormControl>
                <FormLabel>交房日期</FormLabel>
                <Input type="date" name="handover_date" />
              </FormControl>

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>学位</FormLabel>
                  <Input name="degree" placeholder="请输入" />
                </FormControl>
              )}

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>户口</FormLabel>
                  <Select name="household">
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

              <FormControl required>
                <FormLabel>来源</FormLabel>
                <Select name="source">
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

              <FormControl required>
                <FormLabel>唯一住房</FormLabel>
                <Select name="unique_housing">
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

              <FormControl required>
                <FormLabel>全款</FormLabel>
                <Select name="full_payment">
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

              <FormControl required>
                <FormLabel>抵押</FormLabel>
                <Select name="mortgage">
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

              <FormControl required>
                <FormLabel>急切</FormLabel>
                <Select name="urgent">
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

              {isShowRelation([{ purpose: "仓库" }]) && (
                <FormControl required>
                  <FormLabel>配套</FormLabel>
                  <Select multiple name="support">
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

              {isShowRelation([{ purpose: "商铺" }]) && (
                <FormControl required>
                  <FormLabel>配套</FormLabel>
                  <Select multiple name="support">
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

              {isShowRelation([{ purpose: "写字楼" }]) && (
                <FormControl required>
                  <FormLabel>配套</FormLabel>
                  <Select multiple name="support">
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

              {isShowRelation([
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <FormControl required>
                  <FormLabel>配套</FormLabel>
                  <Select multiple name="support">
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

              <FormControl required>
                <FormLabel>现状</FormLabel>
                <Select name="present_state">
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

              <FormControl required>
                <FormLabel>外网同步</FormLabel>
                <Select name="external_sync">
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

              <FormControl>
                <FormLabel>备注</FormLabel>
                <Textarea placeholder="请输入" name="remark" />
              </FormControl>
            </Stack>
          </form>
        </CardContent>
        <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
            <Button size="sm" variant="outlined" color="neutral">
              Cancel
            </Button>
            <Button size="sm" variant="solid">
              Save
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Box>
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
