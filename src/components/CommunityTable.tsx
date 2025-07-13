"use client";
import React, { useState } from "react";
import type {
  CellClickedEvent,
  CellDoubleClickedEvent,
  ColDef,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import { Box, Stack, Typography, useColorScheme } from "@mui/joy";
import { Community } from "@/models/house";
import { darkTheme, lightTheme } from "./agGridTheme";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
type IRow = Partial<Community>;

// Create new GridExample component
export function CommunityTable() {
  const { mode } = useColorScheme();

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IRow[]>([
    {
      id: "1",
      name: "小区名称",
      address: "小区地址",
      year_built: "小区年限",
      typecode: "小区类型",
      district: "所属行政区",
      images: "小区图片",
    },
    {
      id: "1",
      name: "小区名称",
      address: "小区地址",
      year_built: "小区年限",
      typecode: "小区描述",
      district: "所属行政区",
      images: "小区图片",
    },
  ]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { field: "name", headerName: "小区名称", pinned: "left" },
    { field: "address", headerName: "小区地址" },
    { field: "year_built", headerName: "小区年限" },
    { field: "typecode", headerName: "小区描述" },
    { field: "district", headerName: "所属行政区" },
    {
      field: "images",
      headerName: "小区图片",
      cellRenderer: (params: any) => {
        return params.value === "active" ? "✅ 启用" : "❌ 禁用";
      },
    },
    {
      field: "description",
      headerName: "小区描述",
      minWidth: 200,
      initialFlex: 1,
    },
  ]);

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
      <AgGridReact
        cellSelection={false}
        rowData={rowData}
        sideBar
        theme={mode === "dark" ? darkTheme : lightTheme}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        localeText={AG_GRID_LOCALE_CN}
        onCellDoubleClicked={handleCellClick}
      />
    </Stack>
  );
}

// Render GridExample
