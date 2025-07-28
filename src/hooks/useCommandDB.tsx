import { queryClient } from "@/libs/QueryProvider";
import { queryCollectionOptions } from "@tanstack/db-collections";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import z from "zod";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import DeckTwoToneIcon from "@mui/icons-material/DeckTwoTone";
import TableViewTwoToneIcon from "@mui/icons-material/TableViewTwoTone";
import RoomPreferencesTwoToneIcon from "@mui/icons-material/RoomPreferencesTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";

const commandSchema = z.object({
  command: z.string(),
  group: z.string(),
  commandLabel: z.string().optional(),
  description: z.string().optional(),
  icon: z.any().optional(),
  data: z.any().optional(),
});

type CommandItem = z.infer<typeof commandSchema>;

export const commandCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["commandCollection"],
    queryClient,
    schema: commandSchema,
    queryFn: async () => {
      return Promise.resolve([
        {
          group: "房源",
          command: "出售",
          description: "查看出售房源",
          icon: <OutboxRoundedIcon />,
        },
        {
          group: "房源",
          command: "出租",
          description: "查看租房房源",
          icon: <DeckTwoToneIcon />,
        },
        {
          group: "房源",
          command: "AddHouse",
          commandLabel: "添加房源",
          description: "添加房源",
          icon: "➕",
        },
        {
          group: "房源",
          command: "全部房源",
          description: "查看全部房源",
          icon: <TableViewTwoToneIcon />,
        },
        {
          group: "用户",
          command: "user",
          commandLabel: "用户管理",
          description: "查看用户信息",
          icon: <RoomPreferencesTwoToneIcon />,
        },
        {
          group: "用户",
          command: "role",
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

  console.log(data);

  const dataMap = data.reduce((pre, cur) => {
    if (!pre.has(cur.group)) {
      pre.set(cur.group, {
        group: cur.group,
        commands: [],
      });
    }

    pre.get(cur.group)?.commands.push(cur);
    return pre;
  }, new Map<string, { group: string; commands: CommandItem[] }>());

  return dataMap.values().toArray();
};
