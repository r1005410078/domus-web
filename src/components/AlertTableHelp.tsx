"use client";

import { Alert, IconButton, Typography } from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import ContactSupportTwoToneIcon from "@mui/icons-material/ContactSupportTwoTone";
export function AlertTableHelp({ name }: { name: string }) {
  const storage_key = `alertTableHelpVisible_${name}`;

  const [alertTableHelpVisible, setAlertTableHelpVisible] = useState(
    (localStorage.getItem(storage_key) ?? "true") === "true"
  );

  if (!alertTableHelpVisible) {
    return (
      <IconButton aria-label="Open in new tab" component="a" href="#as-link">
        <ContactSupportTwoToneIcon
          onClick={() => {
            localStorage.removeItem(storage_key);
            setAlertTableHelpVisible(true);
          }}
        />
      </IconButton>
    );
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
          双击表格单元格进行编辑，双击序号查看整行数据，右键查看更多操作
        </Typography>
      </div>
    </Alert>
  );
}
