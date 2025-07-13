import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function Pagination() {
  return (
    <div>
      <Box
        className="Pagination-laptopUp"
        sx={{
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
          px: 2,
          py: 1,
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIosRoundedIcon />}
        ></Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "9", "10", "11"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "plain" : "soft"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<ArrowForwardIosRoundedIcon />}
        ></Button>
      </Box>
    </div>
  );
}
