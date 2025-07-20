"use client";

/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import Typography from "@mui/joy/Typography";

import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import {
  useDeleteUser,
  useRoleList,
  useRoleMap,
  useUserList,
} from "@/hooks/useUser";
import { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Permission, Role, User } from "@/models/user";
import { dateToString, emptyToString } from "@/models/house";
import { AgGridReact } from "ag-grid-react";
import { darkTheme, lightTheme } from "./agGridTheme";
import EditorUser from "./EditorUser";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  LicenseManager,
  ColumnsToolPanelModule,
} from "ag-grid-enterprise";
import { mdComfirm } from "./Confirm";
import { useAddUserModal } from "@/hooks/useAddUserModal";

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

type IRow = User;

export default function UserTable() {
  const { editorModal, openUserEditModal } = useAddUserModal();
  const { mode } = useColorScheme();
  const gridRef = React.useRef<AgGridReact>(null);
  const { data: rowData } = useUserList();
  const { mutate } = useDeleteUser();

  const rolesMap = useRoleMap();
  const colDefs: ColDef<IRow>[] = [
    {
      headerName: "序号",
      valueGetter: (params: any) => params.node!.rowIndex! + 1,
      width: 100,
      pinned: "left",
      suppressMovable: true,
      cellClass: "ag-cell-center",
    },
    { field: "username", headerName: "用户名称", width: 120 },
    { field: "phone", headerName: "手机号" },
    { field: "email", headerName: "邮件" },
    {
      field: "updated_at",
      headerName: "更新时间",
      width: 200,
      valueGetter: (params: any) => dateToString(params.data.updated_at),
    },
    {
      field: "roles",
      initialFlex: 1,
      headerName: "角色",
      valueGetter: (params: any) =>
        (params.data.roles as string[])
          ?.map((id) => rolesMap?.get(id)?.name)
          .filter((v) => v)
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
  });

  const defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    sortable: true,
    resizable: true,
  };

  const handleCellClick = (event: CellDoubleClickedEvent<User>) => {
    console.log("单元格点击:", event);
    console.log("行数据:", event.data);
    console.log("列字段:", event.colDef.field);
    console.log("值:", event.value);
  };

  const getContextMenuItems = (params: any) => {
    const defaultItems = params.defaultItems || [];
    const items: any[] = [
      {
        name: params.node ? "编辑用户" : "新增用户",
        action: () => {
          openUserEditModal(params.node?.data ?? {});
        },
        icon: "✏️",
      },
    ];

    if (params.node) {
      items.push({
        name: "删除用户",
        action: () => {
          mdComfirm({
            title: "删除用户",
            content: "确定删除用户吗?",
            onOK: (state) => {
              mutate(params.node?.data.user_id);
              state.close();
            },
            onCancel: (state) => {
              state.close();
            },
          });
        },
        icon: "🗑️",
      });
    }

    items.push("separator");
    // 包含默认菜单项
    items.push(...defaultItems);

    return items;
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        height: "100%",
        width: "100%",
        display: { md: "flex", xs: "none" },
      }}
    >
      <Typography level="h3">用户管理</Typography>
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
              openUserEditModal({});
            }}
          >
            添加用户
          </Button>
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
      {editorModal}
    </Stack>
  );
}
