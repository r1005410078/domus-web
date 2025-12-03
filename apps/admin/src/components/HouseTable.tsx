"use client";

import React, { useState } from "react";
import type { CellDoubleClickedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import {
  Box,
  Button,
  DialogTitle,
  Drawer,
  Link,
  ModalClose,
  Sheet,
  Stack,
  Table,
  Typography,
  useColorScheme,
} from "@mui/joy";
import { Community, HouseForm } from "@/models/house";
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
import { houseDataFuseKeys } from "@/schema/house";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { colDefs, getHouseDataByColDef, IHouseRow } from "./HouseTableConfig";

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

export interface HouseTable {}

// Create new GridExample component
export default function HouseTable({}: HouseTable) {
  const [detailEditField, setDetailEditField] = useState<keyof HouseForm>();
  const [editItem, setEditItem] = useState<IHouseRow | null>(null);
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

  // 全局检索
  const { fuseRowData, fuseSearchNode } = useFuseSearch(
    getHouseDataByColDef(rowData),
    {
      keys: houseDataFuseKeys, // 要模糊搜索的字段
      threshold: 0.6,
    }
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
                          ((value as IHouseRow["images"]) || []).map(
                            (item) => ({
                              src: item.url,
                              key: item.name,
                            })
                          )
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

    let field = event.colDef.field as keyof IHouseRow;

    setEditItem((event.data ?? {}) as IHouseRow);
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
                  ((params.value as IHouseRow["images"]) || []).map((item) => ({
                    src: item.url,
                    key: item.name,
                  }))
                );
                return;
              } else {
                openDetail(params.value);
              }
            },
            icon: "🔍",
          },
        ]
      );
    }

    items.push(
      ...[
        "separator",
        params.node?.data
          ? {
              name: "编辑房源",
              action: () => {
                setEditItem(params.node?.data ?? {});
                if (field) {
                  setDetailEditField(field);
                } else {
                  openEditorHouse(true);
                }
              },
              icon: "✏️",
            }
          : null,
        {
          name: "新增房源",
          action: () => {
            setEditItem(null);
            openEditorHouse(true);
          },
          icon: "🏡",
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
      ].filter(Boolean)
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
            houseCollection.insert(data as any);
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
          <Stack direction="column" spacing={2}>
            <AlertTableHelp name="HouseTable" />
            {fuseSearchNode}
          </Stack>
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
          rowData={fuseRowData}
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
          paginationPageSizeSelector={[100, 200, 500, 1000, 2000]}
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
          if (reason === "backdropClick") return;
          setEditItem(null);
          openEditorHouse(false);
        }}
      >
        <ModalClose />
        <DialogTitle>{editItem?.id ? "编辑房源" : "添加房源"}</DialogTitle>
        <Box sx={{ height: "100%", width: { xs: "100%", md: "430px" } }}>
          <House.Form
            key={editItem?.id ?? "new"}
            value={editItem}
            onSubmit={() => {
              setEditItem(null);
              openEditorHouse(false);
            }}
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
                  .filter(Boolean)
                  .map((item) => {
                    return [
                      <th scope="row">{item!.label}</th>,
                      <td>
                        {item!.content || (
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
