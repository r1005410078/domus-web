"use client";

import { Alert, IconButton, Typography } from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";

export function AlertTableHelp({ name }: { name: string }) {
  const storage_key = `alertTableHelpVisible_${name}`;

  const [alertTableHelpVisible, setAlertTableHelpVisible] = useState(
    (localStorage.getItem(storage_key) ?? "true") === "true"
  );

  if (!alertTableHelpVisible) {
    return null;
  }
  return (
    <Alert
      sx={{ alignItems: "flex-start" }}
      startDecorator={<InfoIcon />}
      variant="soft"
      title="操作提示"
      color="neutral"
      endDecorator={
        <IconButton
          variant="soft"
          color="neutral"
          onClick={() => {
            setAlertTableHelpVisible(false);
            localStorage.setItem(storage_key, "false");
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      }
    >
      <div>
        <div>操作提示</div>
        <Typography level="body-sm" color="neutral">
          双击序号单元格查看详情其他则放大，右键菜单可进行编辑操作
        </Typography>
      </div>
    </Alert>
  );
}
