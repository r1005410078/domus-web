"use client";

import * as React from "react";
import Card, { CardProps } from "@mui/joy/Card";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";

import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

export default function DropZone(
  props: CardProps & { icon?: React.ReactElement<any> }
) {
  const { icon, sx, ...other } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 这里可以处理文件上传逻辑
    const files = event.target.files;
    if (files && files.length > 0) {
      // 处理文件
      console.log(files[0]);
    }
  };

  return (
    <Card
      variant="soft"
      {...other}
      onClick={handleClick}
      sx={[
        {
          borderRadius: "sm",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          px: 3,
          flexGrow: 1,
          boxShadow: "none",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AspectRatio
        ratio="1"
        variant="solid"
        color="primary"
        sx={{ minWidth: 32, borderRadius: "50%", "--Icon-fontSize": "16px" }}
      >
        <div>{icon ?? <FileUploadRoundedIcon />}</div>
      </AspectRatio>
      <Typography level="body-sm" sx={{ textAlign: "center" }}>
        <Link component="button" overlay>
          点击这里打开上传
        </Link>
        或拖拽文件到此处
        <br /> 支持 SVG、PNG、JPG 或 GIF（最大 800x400 像素）
      </Typography>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".svg,.png,.jpg,.jpeg,.gif"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Card>
  );
}
