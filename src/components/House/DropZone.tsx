"use client";

import * as React from "react";
import Card, { CardProps } from "@mui/joy/Card";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";

import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useApplyUploadHouseUrl } from "@/hooks/useApplyUploadHouseUrl";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { useToast } from "@/lib/ToastProvider";
import {
  Box,
  Button,
  CardContent,
  CardCover,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/joy";
import { FileInfo } from "@/models/house";
import { create } from "zustand";
import DeleteIcon from "@mui/icons-material/Delete";

export type UploadFile = {
  file: File;
  url: string;
  filename: string;
  percent: number;
  // state
  state?: "uploading" | "zipping";
  deleted?: boolean;
};

export type Store = {
  files: UploadFile[];
  uploads: () => Promise<any>;
  addFile: (file: File, url: string, filename: string) => void;
  removeFile: (file: File) => void;
};

export const useUploadFiles = create<Store>()((set, get) => ({
  files: [],
  removeFile: (file) => {
    set((state) => ({
      files: state.files.map((f) => {
        if (f.file === file) {
          return { ...f, deleted: true };
        }

        return f;
      }),
    }));
  },
  uploads: () => {
    const files = get().files;
    const promises = files
      .filter((f) => !f.deleted)
      .map(async ({ file, url }) => {
        const options = {
          maxSizeMB: 0.2, // 0.2 MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (percentage: number) => {
            set((state) => ({
              files: state.files.map((f) => {
                if (f.url === url) {
                  return { ...f, percent: percentage * 0.5, state: "zipping" };
                }
                return f;
              }),
            }));
          },
        };

        // 压缩图片
        try {
          file = await imageCompression(file, options);
          console.log("Compressed file size:", file.size / 1024 / 1024, "MB");
        } catch (error) {
          console.log(error);
        }

        return axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );

            set((state) => ({
              files: state.files.map((f) => {
                if (f.url === url) {
                  return { ...f, percent, state: "uploading" };
                }
                return f;
              }),
            }));

            if (percent === 100) {
              setTimeout(() => {
                set((state) => ({
                  files: state.files.filter((f) => f.url !== url),
                }));
              }, 300);
            }
          },
        });
      });

    return Promise.all(promises);
  },

  addFile: (file, url, filename) => {
    set((state) => ({
      files: [...state.files, { file, url, percent: 0, filename }],
    }));
  },
}));

export interface DropZoneProps {
  icon?: React.ReactElement<any>;
  directory?: string;
  onChange: (value: FileInfo[]) => void;
  value?: FileInfo[];
}

export default function DropZone(props: DropZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { mutateAsync } = useApplyUploadHouseUrl();
  const toast = useToast();

  const { value: onlineFiles, onChange } = props;
  const { addFile, files } = useUploadFiles();

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
      for (const file of files) {
        const filename = `timestamp_${Date.now()}_${file.name}`;
        const result = await mutateAsync({ filename, directory });
        const url = result.data.data;

        addFile(file, url, filename);
      }
    }
  };

  React.useEffect(() => {
    let unsub = useUploadFiles.subscribe((state) => {
      const { files } = state;
      const fileInfos: FileInfo[] = files
        .filter((f) => !f.deleted)
        .map((f) => {
          const url = new URL(f.url);
          return {
            name: f.filename,
            url: url.origin + url.pathname,
            size: f.file.size.toString(),
            type: f.file.type,
          };
        });

      onChange(
        fileInfos.concat(
          (onlineFiles || []).filter(
            (f) => !files.some((ff) => ff.filename === f.name)
          )
        )
      );
    });
    return () => {
      unsub();
    };
  }, [onlineFiles]);

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
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Card>
      <Grid
        container
        spacing={2}
        sx={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        {files
          .filter((f) => !f.deleted)
          .map((file, index) => (
            <Grid width={"50%"} key={file.filename}>
              <FileReview key={index} {...file} />
            </Grid>
          ))}
      </Grid>
      <Divider />
      <Grid
        container
        spacing={2}
        sx={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        {onlineFiles
          ?.filter(
            (f) => files.findIndex((file) => file.filename === f.name) === -1
          )
          .map((file, index) => (
            <Grid width={"50%"} key={file.name}>
              <ImageReview
                key={index}
                {...file}
                onRemove={(name) => {
                  onChange(onlineFiles?.filter((f) => f.name !== name));
                }}
              />
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
}

function FileReview(props: UploadFile) {
  const { file, percent, state } = props;
  const { removeFile } = useUploadFiles();
  const stateLabel = React.useMemo(() => {
    switch (state) {
      case "uploading":
        return "上传中";
      case "zipping":
        return "压缩中";
      default:
        return "";
    }
  }, [state]);

  return (
    <Card component="li" sx={{ width: "100%", height: "200px" }}>
      <CardCover>
        <img src={URL.createObjectURL(file)} alt={file.name} loading="lazy" />
      </CardCover>
      <CardContent
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <LinearProgress
          determinate
          variant="outlined"
          color="neutral"
          size="sm"
          thickness={24}
          value={Number(percent!)}
          sx={{
            "--LinearProgress-radius": "20px",
            "--LinearProgress-thickness": "24px",
          }}
        >
          <Typography
            level="body-xs"
            textColor="common.white"
            sx={{ fontWeight: "xl", mixBlendMode: "difference" }}
          >
            {stateLabel} {`${Math.round(Number(percent!))}%`}
          </Typography>
        </LinearProgress>

        <IconButton
          variant="plain"
          color="danger"
          size="lg"
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={() => {
            removeFile(file);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

function ImageReview(props: FileInfo & { onRemove: (name: string) => void }) {
  const { url, name, onRemove } = props;
  const { removeFile } = useUploadFiles();
  return (
    <Card component="li" sx={{ width: "100%", height: "200px" }}>
      <CardCover>
        <img src={url} alt={name} loading="lazy" />
      </CardCover>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          variant="plain"
          color="danger"
          size="lg"
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={() => {
            onRemove(name);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
