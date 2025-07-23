"use client";
import React, { useEffect, useState } from "react";
import Menu from "@mui/joy/Menu";
import type { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  Link,
  ModalClose,
  Sheet,
  Stack,
  Table,
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
import "@/utils/crypto-polyfill";
import { useHouseDB } from "@/hooks/useHouseDB";

import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  LicenseManager,
  ColumnsToolPanelModule,
} from "ag-grid-enterprise";
import House from "./House";
import { useModalContent } from "@/hooks/useModalContent";
import { AlertTableHelp } from "./AlertTableHelp";
import { EditDetailDrawer } from "./EditDetail";
import { mdComfirm } from "./Confirm";

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
type IRow = Partial<HouseForm>;

interface HouseTable {}

// Create new GridExample component
export default function HouseTable({}: HouseTable) {
  const [detailEditField, setDetailEditField] = useState<keyof HouseForm>();
  const [editItem, setEditItem] = useState<IRow | null>(null);
  const [visibleOpenEditorHouse, openEditorHouse] = useState<boolean>();
  const {
    houseDataSource: rowData,
    refreshHouse,
    forceRefreshHouse,
    houseCollection,
  } = useHouseDB();
  const { openDetail, detailModal, openImages } = useModalContent({
    layout: "center",
    title: "房源详情",
  });

  const { mode } = useColorScheme();
  const gridRef = React.useRef<AgGridReact>(null);
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
      {
        field: "images",
        headerName: "图片",
        width: 100,
        cellRenderer: (params: any) =>
          params.value?.length ? `📷 共 ${params.value.length} 张` : null,
      },
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
          emptyToString(params.data?.rent_low_price, "元/月"),
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
      { field: "unique_housing", headerName: "唯一住房" },
      { field: "full_payment", headerName: "全款" },
      { field: "mortgage", headerName: "抵押" },
      { field: "urgent", headerName: "急切" },
      { field: "support", headerName: "配套" },
      { field: "present_state", headerName: "现状" },
      { field: "external_sync", headerName: "外网同步" },
      { field: "remark", headerName: "备注" },

      {
        field: "updated_at",
        headerName: "更新时间",
        cellRenderer: (params: any) => dateToString(params.data?.updated_at),
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

  const openTabelRowDetail = (event: CellDoubleClickedEvent<Community>) => {
    openDetail(
      <Sheet>
        <DescriptionList
          items={
            colDefs
              .filter((item) => item.headerName !== "序号")
              .map((item) => {
                // @ts-ignore
                const value = event.data![item.field];
                let content = value;
                if (typeof item.valueGetter == "function") {
                  content = item.valueGetter(event as any);
                }

                if (typeof item.cellRenderer == "function") {
                  content = item.cellRenderer({
                    value: content,
                  });
                }

                if (item.field === "images") {
                  content = (
                    <Link
                      onClick={() =>
                        openImages(
                          ((value as IRow["images"]) || []).map((item) => ({
                            src: item.url,
                            key: item.name,
                          }))
                        )
                      }
                    >
                      {content}
                    </Link>
                  );
                }

                return {
                  key: item.field,
                  label: item.headerName,
                  content,
                };
              }) as DescriptionItem[]
          }
        />
      </Sheet>
    );
  };

  const handleCellClick = (event: CellDoubleClickedEvent<Community>) => {
    console.log("单元格点击:", event);
    console.log("行数据:", event.data);
    console.log("列字段:", event.colDef.field);
    console.log("值:", event.value);

    let field = event.colDef.field as keyof IRow;

    setEditItem((event.data ?? {}) as IRow);
    setDetailEditField(field);
    if (!field) {
      openTabelRowDetail(event);
    }
  };

  const getContextMenuItems = (params: any) => {
    const field = params.column.colDef.field;
    const defaultItems = params.defaultItems || [];

    let viewCell = field == "images" ? "查看图片" : "单元格详情";

    const items = [];

    if (params.node) {
      items.push(
        ...[
          {
            name: "查看行数据",
            action: () => {
              openTabelRowDetail(params.node);
            },
            icon: "👀",
          },
          {
            name: viewCell,
            action: () => {
              if (field === "images") {
                openImages(
                  ((params.value as IRow["images"]) || []).map((item) => ({
                    src: item.url,
                    key: item.name,
                  }))
                );
                return;
              } else {
                openDetail(params.value);
              }
            },
            icon: "👀",
          },
        ]
      );
    }

    items.push(
      ...[
        "separator",
        {
          name: params.node ? "编辑房源" : "新增房源",
          action: () => {
            setEditItem(params.node?.data ?? {});
            setDetailEditField(field);
            if (!field) {
              openEditorHouse(true);
            }
          },
          icon: "✏️",
        },
        params.node
          ? {
              name: "删除房源",
              icon: "🗑️",
              action: () => {
                mdComfirm({
                  title: "删除房源",
                  content: "确定删除房源吗?",
                  onOK: (state) => {
                    houseCollection.delete(params.node?.data.id);
                    state.close();
                  },
                  onCancel: (state) => {
                    state.close();
                  },
                });
              },
            }
          : null,
      ]
    );

    items.push(
      ...([
        "separator",
        {
          name: "刷新",
          action: () => refreshHouse(),
          icon: "🔄",
        },
        {
          name: "强制刷新",
          action: () => forceRefreshHouse(),
          icon: "🔃",
        },
      ] as any)
    );

    return [
      ...items,
      "separator",
      ...defaultItems, // 包含默认菜单项
    ];
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <>
      <EditDetailDrawer
        detailEditField={detailEditField}
        houseDetail={editItem as HouseForm}
        onSave={(data) => {
          if (data.id) {
            houseCollection.update(data.id, (drafts) => {
              return {
                ...drafts,
                ...data,
              };
            });
          } else {
            houseCollection.insert(data);
          }
        }}
        onClose={() => {
          setEditItem(null);
          setDetailEditField(undefined);
        }}
      />
      <Stack
        direction="column"
        spacing={2}
        sx={{ height: "100%", width: "100%" }}
      >
        <Typography level="h3">房源管理</Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <AlertTableHelp name="HouseTable" />
          <Stack
            direction="row"
            spacing={2}
            flex={1}
            justifyContent={"flex-end"}
          >
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
                setEditItem(null);
                openEditorHouse(true);
              }}
            >
              新增房源
            </Button>
          </Stack>
        </Stack>
        <AgGridReact
          cellSelection
          getRowId={(params) => {
            return params.data.id;
          }}
          rowSelection="single"
          rowData={rowData}
          theme={mode === "dark" ? darkTheme : lightTheme}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          ref={gridRef}
          localeText={AG_GRID_LOCALE_CN}
          onCellDoubleClicked={handleCellClick}
          sideBar={{ toolPanels: ["columns"] }}
          preventDefaultOnContextMenu={true}
          getContextMenuItems={getContextMenuItems}
        />
      </Stack>
      <Drawer
        anchor="bottom"
        sx={{}}
        slotProps={{
          content: {
            sx: {
              height: "100vh",
              width: { xs: "100%", md: "430px" },
              top: 0,
              left: { xs: 0, md: "calc(50% - 215px)" },
              borderRadius: 0,
              boxShadow: "lg",
              p: 0,
              backgroundColor: "background.body",
              overflow: "auto",
            },
          },
        }}
        open={!!visibleOpenEditorHouse}
        onClose={(_, reason) => {
          setEditItem(null);
          openEditorHouse(false);
        }}
      >
        <ModalClose />
        <DialogTitle>添加房源</DialogTitle>
        <Box sx={{ height: "100%", width: { xs: "100%", md: "430px" } }}>
          <House.Form
            key={editItem?.id ?? "new"}
            value={editItem}
            onSubmit={() => setEditItem(null)}
          />
        </Box>
      </Drawer>
      {detailModal}
    </>
  );
}

// Render GridExample

type DescriptionItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

type DescriptionListProps = {
  items: DescriptionItem[];
};

export const DescriptionList: React.FC<DescriptionListProps> = ({ items }) => {
  const groups = [];

  for (let i = 0; i < items.length; i += 3) {
    const group = [];
    for (let j = 0; j < 3 && i + j < items.length; j++) {
      group.push(items[i + j]);
    }

    groups.push(group);
  }
  return (
    <Box>
      <Sheet variant="outlined">
        <Table variant="soft" borderAxis="bothBetween">
          <tbody>
            {groups.map((group, i) => (
              <tr key={i}>
                {group
                  .map((item) => {
                    return [
                      <th scope="row">{item.label}</th>,
                      <td>
                        {item.content || (
                          <span style={{ opacity: 0.5 }}>未填写</span>
                        )}
                      </td>,
                    ];
                  })
                  .flat()}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};
