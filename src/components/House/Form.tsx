import { Check, InfoOutlined } from "@mui/icons-material";
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
  List,
  ListDivider,
  ListItem,
  Chip,
  optionClasses,
  listItemDecoratorClasses,
  ListItemDecorator,
  Autocomplete,
} from "@mui/joy";
import { Fragment } from "react";

export function Form() {
  return (
    <Box
      sx={{
        width: "430px",
        background: "background.surface",
        // border: 1,
        // borderColor: "divider",
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
                <Select placeholder="用途" name="purpose">
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
                <Select placeholder="交易类型" name="transaction_type">
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
                      <Select
                        variant="plain"
                        defaultValue={"本人"}
                        onChange={(_, value) => {}}
                        slotProps={{
                          listbox: {
                            variant: "outlined",
                          },
                        }}
                        sx={{ mr: -1.5, "&:hover": { bgcolor: "transparent" } }}
                      >
                        {ownerNameOptions.map((item) => {
                          return (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
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
                      <Select
                        variant="plain"
                        defaultValue={"本人"}
                        onChange={(_, value) => {}}
                        slotProps={{
                          listbox: {
                            variant: "outlined",
                          },
                        }}
                        sx={{ mr: -1.5, "&:hover": { bgcolor: "transparent" } }}
                      >
                        {ownerNameOptions.map((item) => {
                          return (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </>
                  }
                  sx={{ width: 300 }}
                />
              </FormControl>
              {/* 使用高德地图 */}
              <FormControl required>
                <FormLabel>小区</FormLabel>
                <Autocomplete
                  options={[]}
                  name="community_address"
                  placeholder="小区"
                />
              </FormControl>

              <Divider inset="none" />

              <FormControl>
                <FormLabel>楼层</FormLabel>
                <Stack direction="row" spacing={2}>
                  <Input placeholder="请输入" name="door_number_from" />
                  <Divider orientation="vertical">到</Divider>
                  <Input placeholder="请输入" name="door_number_to" />
                  <Divider orientation="vertical">楼</Divider>
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>门牌号</FormLabel>
                <Stack direction="row" spacing={2}>
                  <Input placeholder="座栋" name="building_number" />
                  <Divider orientation="vertical" />
                  <Input placeholder="单元" name="unit_number" />
                  <Divider orientation="vertical" />
                  <Input placeholder="门牌号" name="door_number" />
                </Stack>
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
