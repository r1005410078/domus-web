import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { useCommandDB, CommandItemType } from "./useCommandDB";
import { EmptyState } from "@/components/EmptyState";

export interface CommandModalOptions {
  onSelect?: ((command: CommandItemType, value: string) => void) | undefined;
}

export function useCommandModal({ onSelect }: CommandModalOptions) {
  const [openCmdk, setOpenCmdk] = useState(false);
  const commandData = useCommandDB();

  const commandDialog = (
    <CommandDialog
      open={openCmdk}
      onOpenChange={setOpenCmdk}
      filter={(value, search) => {
        if (value.includes(search)) return 1;
        return 0;
      }}
    >
      <CommandInput placeholder="请输入..." />
      <CommandList>
        <CommandEmpty>
          <EmptyState isEmpty />
        </CommandEmpty>
        {commandData.map((item) => {
          return (
            <CommandGroup heading={item.group}>
              {item.commands.map((command) => {
                return (
                  <CommandItem
                    key={command.command}
                    value={command.command}
                    onSelect={(value) => onSelect?.(command, value)}
                  >
                    {command.icon}
                    <span>{command.commandLabel || command.command}</span>
                    {/* <CommandShortcut>⌘P</CommandShortcut> */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );

  return {
    openCmdk,
    setOpenCmdk,
    commandDialog,
  };
}
