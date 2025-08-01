"use client";

import { queryClient } from "@/lib/QueryProvider";
import { queryCollectionOptions } from "@tanstack/db-collections";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import z from "zod";
import "@/utils/crypto-polyfill";

const commandSchema = z.object({
  command: z.string(),
  group: z.string(),
  commandLabel: z.string().optional(),
  description: z.string().optional(),
  action: z.string().optional(),
  icon: z.any().optional(),
  data: z.any().optional(),
});

export type CommandItemType = z.infer<typeof commandSchema>;

export const commandCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["commandCollection"],
    queryClient,
    schema: commandSchema,
    queryFn: async () => {
      return Promise.resolve([
        {
          group: "房源",
          command: "AddHouse",
          commandLabel: "添加房源",
          description: "添加房源",
          icon: "➕",
        },
        {
          group: "房源",
          command: "/house/sold",
          commandLabel: "出售房源",
          description: "查看出售房源",
          action: "link",
          icon: <OutboxRoundedIcon />,
        },
        {
          group: "房源",
          command: "/house/rent",
          action: "link",
          commandLabel: "出租房源",
          description: "查看租房房源",
          icon: <DeckTwoToneIcon />,
        },

        {
          group: "房源",
          command: "/house/house",
          action: "link",
          commandLabel: "全部房源",
          description: "查看全部房源",
          icon: <TableViewTwoToneIcon />,
        },
        {
          group: "用户",
          command: "/user/profiles",
          action: "link",
          commandLabel: "用户管理",
          description: "查看用户信息",
          icon: <RoomPreferencesTwoToneIcon />,
        },
        {
          group: "用户",
          command: "/user/role",
          action: "link",
          commandLabel: "角色管理",
          description: "查看角色信息",
          icon: <ManageAccountsTwoToneIcon />,
        },
      ]);
    },
    getKey: (item) => item.group + item.command,
    onInsert: async ({ transaction }) => {},
    onUpdate: async ({ transaction }) => {},
    onDelete: async (item) => {},
  })
);

export const useCommandDB = () => {
  const { data } = useLiveQuery((q) => q.from({ commands: commandCollection }));
  const dataMap = data.reduce((pre, cur) => {
    if (!pre.has(cur.group)) {
      pre.set(cur.group, {
        group: cur.group,
        commands: [],
      });
    }

    pre.get(cur.group)?.commands.push(cur);
    return pre;
  }, new Map<string, { group: string; commands: CommandItemType[] }>());

  return Array.from(dataMap.values());
};
