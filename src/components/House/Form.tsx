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
  Box,
} from "@mui/joy";
import React, { useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { HouseForm } from "@/models/house";
import { CommunityForm, HouseOwnerForm } from "./common";
import DropZone, { useUploadFiles } from "./DropZone";
import { useSaveHouse } from "@/hooks/useHouse";
import {
  EditActualRate,
  EditApartmentType,
  EditBuildingArea,
  EditBuildingStructure,
  EditCarHeight,
  EditCertificateDate,
  EditDegree,
  EditDiscountYearLimit,
  EditHouseAddress,
  EditDoorWidth,
  EditDownPayment,
  EditExternalSync,
  EditFloorHeight,
  EditFloorRange,
  EditFullPayment,
  EditHandoverDate,
  EditHouseDecoration,
  EditHousehold,
  EditHouseOrientation,
  EditHouseTitle,
  EditHouseType,
  EditLevel,
  EditMortgage,
  EditPaymentMethod,
  EditPresentState,
  EditProgressDepth,
  EditPropertyRight,
  EditPropertyTax,
  EditPropertyYearLimit,
  EditPurposeSelector,
  EditRemark,
  EditRentLowPrice,
  EditRentPrice,
  EditSaleLowPrice,
  EditSalePrice,
  EditSource,
  EditStairs,
  EditSupport,
  EditTags,
  EditTransactionType,
  EditUniqueHousing,
  EditUrgent,
  EditUseArea,
  EditViewMethod,
  EditPropertyManagementCompany,
} from "../EditDetail";
import { houseFormSchema } from "@/schema/house";
import { useToast } from "@/lib/ToastProvider";
import { getFirstError } from "@/utils";
import { Edit } from "lucide-react";

export interface Relation {
  purpose?: string;
  transaction_type?: string;
}

interface FormProps {
  defaultValues?: Partial<HouseForm> | null;
  value?: Partial<HouseForm> | null;
  onSubmit?: () => void;
}

export function Form({ defaultValues, value, onSubmit }: FormProps) {
  const { mutate } = useSaveHouse();
  const { uploads } = useUploadFiles();
  const toast = useToast();
  const form = useForm({
    defaultValues,
    // validators: {
    //   onChange: houseFormSchema as any,
    // },
    onSubmit: async ({ value }) => {
      mutate(value as HouseForm);
      onSubmit?.();
    },
  });

  const handleSubmit = async () => {
    const errorsMessage = getFirstError(form.getAllErrors());
    if (errorsMessage) {
      toast.showToast({
        message: errorsMessage,
        severity: "danger",
      });
      return;
    }

    await uploads();
    await form.handleSubmit();
  };

  const { purpose, transaction_type, community_name } = useStore(
    form.store,
    (state) => {
      return {
        purpose: state.values?.purpose,
        transaction_type: state.values?.transaction_type,
        community_name: state.values?.community?.name,
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
    <Box sx={{ height: "100%", width: "430px" }}>
      <Card
        sx={{
          background: "background.surface",
          borderRadius: 0,
          border: 0,
          p: 1,
        }}
      >
        <Tabs
          aria-label="tabs"
          defaultValue={0}
          sx={{ p: 0, overflowY: "auto", height: "calc(100vh - 145px)" }}
        >
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
                    <EditPurposeSelector
                      sx={{ gridColumn: "span 2" }}
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  );
                }}
              />

              <form.Field
                name="transaction_type"
                children={(field) => {
                  return (
                    <EditTransactionType
                      sx={{ gridColumn: "span 2" }}
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
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
                      <EditSalePrice
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditSaleLowPrice
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditRentPrice
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([
                { transaction_type: "出租" },
                { transaction_type: "租售" },
              ]) && (
                <form.Field
                  name="rent_low_price"
                  children={(field) => {
                    return (
                      <EditRentLowPrice
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditDownPayment
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                name="house_address"
                children={(field) => {
                  return (
                    <EditHouseAddress
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
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
                      <EditApartmentType
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}
            </Stack>
          </TabPanel>
          <TabPanel value={1}>
            <Stack direction="column" spacing={2}>
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <EditHouseTitle
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  );
                }}
              />
              <form.Field
                name="property_management_company"
                children={(field) => {
                  return (
                    <EditPropertyManagementCompany
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  );
                }}
              />

              <form.Field
                name="floor_range"
                children={(field) => {
                  return (
                    <EditFloorRange
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  );
                }}
              />

              <form.Field
                name="tags"
                children={(field) => {
                  return (
                    <EditTags
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  );
                }}
              />

              {isShowRelation([{ purpose: "车位" }]) && (
                <form.Field
                  name="car_height"
                  children={(field) => {
                    return (
                      <EditCarHeight
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditStairs
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([{ purpose: "仓库" }, { purpose: "写字楼" }]) && (
                <form.Field
                  name="actual_rate"
                  children={(field) => {
                    return (
                      <EditActualRate
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([{ purpose: "写字楼" }]) && (
                <form.Field
                  name="level"
                  children={(field) => {
                    return (
                      <EditLevel
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditFloorHeight
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([{ purpose: "商铺" }]) && (
                <form.Field
                  name="progress_depth"
                  children={(field) => (
                    <EditProgressDepth
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  )}
                />
              )}

              {isShowRelation([{ purpose: "商铺" }]) && (
                <form.Field
                  name="door_width"
                  children={(field) => (
                    <EditDoorWidth
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  )}
                />
              )}

              <form.Field
                name="building_area"
                children={(field) => (
                  <EditBuildingArea
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
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
                      <EditUseArea
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([{ purpose: "车位" }]) && (
                <form.Field
                  name="house_type"
                  children={(field) => {
                    return (
                      <EditHouseType
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([
                { purpose: "仓库" },
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
                { purpose: "写字楼" },
                { purpose: "商铺" },
                { purpose: "厂房" },
              ]) && (
                <form.Field
                  name="house_type"
                  children={(field) => {
                    return (
                      <EditHouseType
                        purpose={purpose}
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditHouseOrientation
                        purpose={purpose}
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                      <EditHouseDecoration
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
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
                    <EditDiscountYearLimit
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
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
                      <EditViewMethod
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              {isShowRelation([
                { transaction_type: "出售" },
                { transaction_type: "出租" },
                { transaction_type: "租售" },
              ]) && (
                <form.Field
                  name="payment_method"
                  children={(field) => {
                    return (
                      <EditPaymentMethod
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
              )}

              <form.Field
                name="property_tax"
                children={(field) => (
                  <EditPropertyTax
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="building_structure"
                children={(field) => (
                  <EditBuildingStructure
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="property_rights"
                children={(field) => (
                  <EditPropertyRight
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="property_year_limit"
                children={(field) => (
                  <EditPropertyYearLimit
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="certificate_date"
                children={(field) => (
                  <EditCertificateDate
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="handover_date"
                children={(field) => (
                  <EditHandoverDate
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
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
                    <EditDegree
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
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
                    <EditHousehold
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  )}
                />
              )}

              <form.Field
                name="source"
                children={(field) => (
                  <EditSource
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="unique_housing"
                children={(field) => (
                  <EditUniqueHousing
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="full_payment"
                children={(field) => (
                  <EditFullPayment
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="mortgage"
                children={(field) => (
                  <EditMortgage
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="urgent"
                children={(field) => (
                  <EditUrgent
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              {isShowRelation([
                { purpose: "仓库" },
                { purpose: "商铺" },
                { purpose: "写字楼" },
                { purpose: "住宅" },
                { purpose: "别墅" },
                { purpose: "公寓" },
              ]) && (
                <form.Field
                  name="support"
                  children={(field) => (
                    <EditSupport
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  )}
                />
              )}

              <form.Field
                name="present_state"
                children={(field) => (
                  <EditPresentState
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="external_sync"
                children={(field) => (
                  <EditExternalSync
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />

              <form.Field
                name="remark"
                children={(field) => (
                  <EditRemark
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              />
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
      </Card>
    </Box>
  );
}
