"use client";
import React, { useState } from "react";
import Menu from "@mui/joy/Menu";
import type { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import {
  Box,
  Button,
  Checkbox,
  Dropdown,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/joy";
import {
  apartmentTypeToString,
  Community,
  communityToString,
  dateToString,
  door_numberToString,
  emptyToString,
  floor_rangeToString,
  HouseForm,
  ownerToString,
  stairsToString,
} from "@/models/house";
import { darkTheme, lightTheme } from "./agGridTheme";
import SettingsIcon from "@mui/icons-material/Settings";
import "@/utils/crypto-polyfill";
import { useHouseDB } from "@/hooks/useHouseDB";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
type IRow = Partial<HouseForm>;

// 列显示缓存
const chacheColDefs: { [key in keyof IRow]: boolean } = (() => {
  try {
    return JSON.parse(localStorage.getItem("chacheColDefs") || "{}");
  } catch (error) {
    return {};
  }
})();

interface HouseTable {}

// Create new GridExample component
export function HouseTable({}: HouseTable) {
  const gridRef = React.useRef<AgGridReact>(null);
  const { mode } = useColorScheme();
  const { houseDataSource: rowData } = useHouseDB();

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>(
    [
      {
        headerName: "序号",
        valueGetter: (params: any) => params.node!.rowIndex! + 1,
        width: 100,
        pinned: "left",
        suppressMovable: true,
        cellClass: "ag-cell-center",
      },
      { field: "title", headerName: "房源标题", pinned: "left" },
      { field: "purpose", width: 100, headerName: "用途" },
      { field: "transaction_type", width: 100, headerName: "交易类型" },
      { field: "house_status", width: 100, headerName: "状态" },
      {
        field: "door_number",
        headerName: "门牌号结构",
        valueGetter: (params: any) => {
          return door_numberToString(params.data.door_number);
        },
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
        valueGetter: (params: any) =>
          floor_rangeToString(params.data.floor_range),
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
          emptyToString(params.data?.building_area, "元/月"),
      },
      {
        field: "down_payment",
        headerName: "首付",
        valueGetter: (params: any) =>
          emptyToString(params.data?.down_payment, "%"),
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
      { field: "delegate_number", headerName: "委托编号" },
      { field: "unique_housing", headerName: "唯一住房" },
      { field: "full_payment", headerName: "全款" },
      { field: "mortgage", headerName: "抵押" },
      { field: "urgent", headerName: "急切" },
      { field: "support", headerName: "配套" },
      { field: "present_state", headerName: "现状" },
      { field: "external_sync", headerName: "外网同步" },
      { field: "remark", headerName: "备注" },
      { field: "images", headerName: "图片" },
      {
        field: "updated_at",
        headerName: "更新时间",
        cellRenderer: (params: any) => dateToString(params.data.updated_at),
      },
    ].map((item: any) => {
      const newItem: ColDef<IRow> = item;
      const field = newItem.field! as keyof typeof chacheColDefs;
      newItem.hide = chacheColDefs[field!];

      if (newItem.cellRenderer === undefined) {
        newItem.cellRenderer = (params: any) => {
          return emptyToString(params.value);
        };
      }

      return newItem;
    })
  );

  const defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    sortable: true,
    resizable: true,
  };

  const handleCellClick = (event: CellDoubleClickedEvent<Community>) => {
    console.log("单元格点击:", event);
    console.log("行数据:", event.data);
    console.log("列字段:", event.colDef.field);
    console.log("值:", event.value);
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
    >
      <Typography level="h3">小区管理</Typography>
      <Stack
        direction="row"
        sx={{ justifyContent: "flex-end", alignItems: "flex-start" }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="warning"
            onClick={() => {
              gridRef.current?.api.exportDataAsCsv();
            }}
          >
            备份导出
          </Button>
          <Dropdown>
            <MenuButton
              color="primary"
              variant="outlined"
              startDecorator={<SettingsIcon />}
            >
              列设置
            </MenuButton>
            <Menu>
              <MenuItem
                slots={{ root: "div" }}
                sx={{ hoverBg: "transparent", width: "300px" }}
              >
                <Stack
                  spacing={1}
                  direction="row"
                  useFlexGap
                  sx={{ p: 2, flexWrap: "wrap", width: 520 }}
                >
                  {colDefs
                    .filter((item) => !!item.field)
                    .map((item) => {
                      return (
                        <Box
                          key={item.field}
                          sx={{ width: 140 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            size="sm"
                            label={item.headerName}
                            value={item.field}
                            checked={!item.hide}
                            onChange={(e) => {
                              e.stopPropagation();
                              const newColDefs = colDefs.map((col) => {
                                if (col.field === item.field) {
                                  const filed =
                                    col.field! as keyof typeof chacheColDefs;

                                  chacheColDefs[filed] = !e.target.checked;
                                  localStorage.setItem(
                                    "chacheColDefs",
                                    JSON.stringify(chacheColDefs)
                                  );
                                  return { ...col, hide: !e.target.checked };
                                }
                                return col;
                              });
                              setColDefs(newColDefs);
                            }}
                          />
                        </Box>
                      );
                    })}
                </Stack>
              </MenuItem>
            </Menu>
          </Dropdown>
        </Stack>
      </Stack>
      <AgGridReact
        cellSelection
        rowSelection="single"
        rowData={rowData}
        theme={mode === "dark" ? darkTheme : lightTheme}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        ref={gridRef}
        localeText={AG_GRID_LOCALE_CN}
        onCellDoubleClicked={handleCellClick}
      />
    </Stack>
  );
}

// Render GridExample
