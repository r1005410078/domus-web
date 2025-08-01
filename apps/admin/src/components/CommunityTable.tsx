"use client";

import React, { use, useState } from "react";
import type { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import { Box, Stack, Typography, useColorScheme } from "@mui/joy";
import { Community, dateToString } from "@/models/house";
import { darkTheme, lightTheme } from "./agGridTheme";
import { useCommunityDB } from "@/hooks/useCommunityDB";

import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  LicenseManager,
  ColumnsToolPanelModule,
} from "ag-grid-enterprise";
import dayjs from "dayjs";
import { useFuseSearch } from "@/hooks/useFuseSearch";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ContextMenuModule,
  ColumnMenuModule,
  CellSelectionModule,
  ClipboardModule,
  ColumnsToolPanelModule,
]);

LicenseManager.setLicenseKey(
  "[v3][RELEASE][0102]_NDg2Njc4MzY3MDgzNw==16d78ca762fb5d2ff740aed081e2af7b"
);

// Row Data Interface
type IRow = Partial<Community>;

// Row Data: The data to be displayed.
// Column Definitions: Defines & controls grid columns.
const colDefs: ColDef<IRow>[] = [
  {
    headerName: "序号",
    valueGetter: (params: any) => params.node!.rowIndex! + 1,
    width: 100,
    pinned: "left",
    suppressMovable: true,
    cellClass: "ag-cell-center",
  },
  { field: "name", headerName: "小区名称", pinned: "left" },
  { field: "address", width: 500, headerName: "小区地址" },
  {
    field: "year_built",
    headerName: "小区年限",
    valueGetter: (params: any) =>
      dayjs(params.data.year_built).format("YYYY年"),
  },
  { field: "typecode", headerName: "小区类型" },
  { field: "district", headerName: "所属行政区" },
  { field: "property_management_company", headerName: "物业公司" },
  {
    field: "description",
    headerName: "小区描述",
    minWidth: 200,
    initialFlex: 1,
  },
  {
    field: "updated_at",
    headerName: "更新时间",
    minWidth: 200,
    initialFlex: 1,
    cellRenderer: (params: any) => {
      return dateToString(params.value);
    },
  },
];

// Create new GridExample component
export default function CommunityTable() {
  const { communitys: rowData } = useCommunityDB();
  const { mode } = useColorScheme();

  // 全局检索
  const { fuseRowData, fuseSearchNode } = useFuseSearch(rowData, {
    keys: ["name", "address", "district", "description"], // 要模糊搜索的字段
    threshold: 0.6,
  });

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

  const getContextMenuItems = (params: any) => {
    const defaultItems = params.defaultItems || [];
    return [
      ...defaultItems, // 包含默认菜单项
    ];
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
    >
      <Typography level="h3">小区管理</Typography>
      <Stack direction="row" spacing={2}>
        <Box sx={{ flexGrow: 0.4 }}>{fuseSearchNode}</Box>
      </Stack>
      <AgGridReact
        cellSelection={true}
        rowSelection="single"
        rowData={fuseRowData}
        theme={mode === "dark" ? darkTheme : lightTheme}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSizeSelector={[100, 200, 500, 1000]}
        localeText={AG_GRID_LOCALE_CN}
        onCellDoubleClicked={handleCellClick}
        sideBar={{ toolPanels: ["columns"] }}
        getContextMenuItems={getContextMenuItems}
      />
    </Stack>
  );
}

// Render GridExample
