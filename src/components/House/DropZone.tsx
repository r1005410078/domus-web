"use client";

import * as React from "react";
import Card, { CardProps } from "@mui/joy/Card";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useApplyUploadHouseUrl } from "@/hooks/useApplyUploadHouseUrl";
import axios from "axios";
import { useToast } from "@/libs/ToastProvider";
import { Stack } from "@mui/joy";
import FileUpload from "./FileUpload";

export interface DropZoneProps {
  icon?: React.ReactElement<any>;
  directory?: string;
  onChange: (value: FileInfo[]) => void;
  value?: FileInfo[];
}

interface FileInfo {
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function DropZone(props: DropZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { mutateAsync } = useApplyUploadHouseUrl();
  const toast = useToast();

  const [newFileItems, setNewFileItems] = React.useState<FileInfo[]>([]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 这里可以处理文件上传逻辑
    const files = event.target.files;
    if (props.directory === undefined) {
      toast.showToast({ message: "小区未选择", severity: "danger" });
      return;
    }

    const directory = props.directory!;

    if (files && files.length > 0) {
      const imageUrls: FileInfo[] = [];
      for (const file of files) {
        const filename = `timestamp_${Date.now()}_${file.name}`;
        const result = await mutateAsync({ filename, directory });
        const url = result.data.data;
        const res = await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );

            const uri = new URL(url);
            const imageUrl = uri.origin + uri.pathname;
            imageUrls.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: imageUrl,
            });
          },
        });

        setNewFileItems(imageUrls);
      }
    }
  };

  React.useEffect(() => {
    props.onChange(newFileItems);
  }, [newFileItems]);

  return (
    <Stack spacing={2} sx={{ my: 1 }}>
      <Card
        variant="soft"
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
        ]}
      >
        <AspectRatio
          ratio="1"
          variant="solid"
          color="primary"
          sx={{ minWidth: 32, borderRadius: "50%", "--Icon-fontSize": "16px" }}
        >
          <div>{<FileUploadRoundedIcon />}</div>
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
      <FileUpload
        icon={<InsertDriveFileRoundedIcon />}
        fileName="Tech design requirements.pdf"
        fileSize="200 kB"
        progress={100}
      />
      <FileUpload
        icon={<VideocamRoundedIcon />}
        fileName="Dashboard prototype recording.mp4"
        fileSize="16 MB"
        progress={40}
      />
    </Stack>
  );
}
