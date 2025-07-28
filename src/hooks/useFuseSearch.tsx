import { Button, Input } from "@mui/joy";
import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface FuseOptions {
  keys: string[];
  threshold: number;
}

export function useFuseSearch<T>(rowData: T[], defaultOptions: FuseOptions) {
  const valueRef = useRef<string>(null);
  const [keyword, setKeyword] = useState<string | null>();

  // 全局检索
  const fuse = useMemo(() => {
    return new Fuse(rowData, {
      keys: defaultOptions.keys, // 要模糊搜索的字段
      threshold: defaultOptions.threshold ?? 0.6,
    });
  }, [rowData]);

  const fuseRowData = useMemo(() => {
    const keyword = valueRef.current;
    if (!keyword) {
      return rowData;
    }

    return fuse.search(keyword).map((item) => item.item);
  }, [keyword, rowData, fuse]);

  const fuseSearchNode = (
    <Input
      variant="outlined"
      placeholder="搜索"
      startDecorator={<SearchRoundedIcon color="primary" />}
      endDecorator={
        <Button onClick={() => setKeyword(valueRef.current)}>搜索</Button>
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
