import { Button, Input } from "@mui/joy";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface FuseOptions {
  keys: string[];
  threshold: number;
  loading?: boolean;
}

export function useFuseSearch<T>(rowData: T[], options: FuseOptions) {
  const valueRef = useRef<string>(null);
  const [keyword, setKeyword] = useState<string | null>();
  const [readOnly, setReadOnly] = useState<boolean>(true);

  // 全局检索
  const fuse = useMemo(() => {
    return new Fuse(rowData, {
      keys: options.keys, // 要模糊搜索的字段
      threshold: options.threshold ?? 0.6,
    });
  }, [rowData]);

  const fuseRowData = useMemo(() => {
    const keyword = valueRef.current;
    if (!keyword) {
      return rowData;
    }

    return fuse.search(keyword).map((item) => item.item);
  }, [keyword, rowData, fuse]);

  useEffect(() => {
    setTimeout(() => setReadOnly(false), 1000);
  }, [keyword]);

  const fuseSearchNode = (
    <Input
      variant="outlined"
      placeholder="搜索"
      autoComplete="off"
      readOnly={readOnly}
      type="text"
      startDecorator={<SearchRoundedIcon color="primary" />}
      endDecorator={
        <Button
          loading={options.loading}
          onClick={() => setKeyword(valueRef.current)}
        >
          搜索
        </Button>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setKeyword(valueRef.current);
        }
      }}
      onChange={(e) => {
        valueRef.current = e.target.value;
      }}
    />
  );

  return {
    fuseRowData,
    fuseSearchNode,
  };
}
