import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export type PaginationProps = {
  count: number;
  pageSize?: number;
  page?: number;
  onChange?: (newPage: number) => void;
};

export default function Pagination({
  count,
  pageSize = 10,
  page,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(count / pageSize);
  const isControlled = page !== undefined;

  const [internalPage, setInternalPage] = React.useState(1);
  const currentPage = isControlled ? page! : internalPage;

  const handleChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (!isControlled) setInternalPage(newPage);
    onChange?.(newPage);
  };

  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("…");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("…");
      pages.push(totalPages);
    }

    return pages.map((p, index) =>
      typeof p === "string" ? (
        <Typography key={index} level="body-sm" sx={{ px: 1 }}>
          {p}
        </Typography>
      ) : (
        <IconButton
          key={index}
          size="sm"
          sx={{ borderRadius: "50%" }}
          variant={p === currentPage ? "solid" : "plain"}
          color={p === currentPage ? "primary" : "neutral"}
          onClick={() => handleChange(p)}
        >
          {p}
        </IconButton>
      )
    );
  };

  return (
    <>
      {/* PC 端分页 */}
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          px: 2,
          width: "100%",
        }}
      >
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowBackIosRoundedIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          {renderPages()}
          <Typography level="body-sm" sx={{ ml: 1 }}>
            第 {currentPage} / {totalPages} 页
          </Typography>
        </Box>

        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowForwardIosRoundedIcon />
        </IconButton>
      </Box>

      {/* 移动端分页 */}
      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 1,
        }}
      >
        <Button
          size="sm"
          variant="plain"
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowBackIosRoundedIcon />
        </Button>

        <Typography level="body-sm">
          第 {currentPage} / {totalPages} 页
        </Typography>

        <Button
          size="sm"
          variant="plain"
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowForwardIosRoundedIcon />
        </Button>
      </Box>
    </>
  );
}
