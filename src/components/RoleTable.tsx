"use client";

/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import Checkbox from "@mui/joy/Checkbox";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useRoleList } from "@/hooks/useUser";
import { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Permission, Role } from "@/models/user";
import { dateToString, emptyToString } from "@/models/house";
import { AgGridReact } from "ag-grid-react";
import { darkTheme, lightTheme } from "./agGridTheme";
import EditorRole from "./EditorRole";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  LicenseManager,
  ColumnsToolPanelModule,
} from "ag-grid-enterprise";

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

type IRow = Role;

export default function RoleTable() {
  const [editItem, setEditItem] = React.useState<Partial<IRow> | null>(null);
  const { data: rowData } = useRoleList();
  const { mode } = useColorScheme();
  const gridRef = React.useRef<AgGridReact>(null);
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = React.useState<ColDef<IRow>[]>(
    [
      {
        headerName: "序号",
        valueGetter: (params: any) => params.node!.rowIndex! + 1,
        width: 100,
        pinned: "left",
        suppressMovable: true,
        cellClass: "ag-cell-center",
      },
      { field: "name", headerName: "角色名称", width: 120 },
      { field: "description", width: 120, headerName: "角色描述" },
      {
        field: "updated_at",
        headerName: "更新时间",
        width: 200,
        valueGetter: (params: any) => dateToString(params.value),
      },
      {
        field: "permissions",
        initialFlex: 1,
        headerName: "权限",
        valueGetter: (params: any) =>
          (params.data.permissions as Permission[])
            ?.map((p) => p.name)
            .join(", "),
      },
    ].map((item: any) => {
      const newItem: ColDef<IRow> = item;
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

  const handleCellClick = (event: CellDoubleClickedEvent<Role>) => {
    console.log("单元格点击:", event);
    console.log("行数据:", event.data);
    console.log("列字段:", event.colDef.field);
    console.log("值:", event.value);
  };

  const getContextMenuItems = (params: any) => {
    const defaultItems = params.defaultItems || [];
    console.log("params", params);
    return [
      {
        name: params.node ? "编辑角色" : "新增角色",
        action: () => {
          setEditItem(params.node?.data ?? {});
        },
        icon: "✏️",
      },
      "separator",
      ...defaultItems, // 包含默认菜单项
    ];
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
    >
      <Typography level="h3">角色管理</Typography>
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
          <Button
            color="primary"
            onClick={() => {
              setEditItem({});
            }}
          >
            添加角色
          </Button>
          <Modal
            open={!!editItem}
            onClose={(_, reason) => {
              console.log("reason", reason);
              if (reason === "backdropClick") return;
              setEditItem(null);
            }}
          >
            <ModalDialog
              aria-labelledby="filter-modal"
              size="lg"
              sx={{ maxWidth: 300 }}
            >
              <ModalClose />
              <DialogTitle>添加角色</DialogTitle>
              <DialogContent>
                <EditorRole role={editItem} onClose={() => setEditItem(null)} />
              </DialogContent>
            </ModalDialog>
          </Modal>
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
        preventDefaultOnContextMenu={true}
        onCellDoubleClicked={handleCellClick}
        sideBar={{ toolPanels: ["columns"] }}
        getContextMenuItems={getContextMenuItems}
      />
    </Stack>
  );
}
