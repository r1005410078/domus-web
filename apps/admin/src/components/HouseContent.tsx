"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";

export function HouseContent() {
  const [open, setOpen] = React.useState([false, false, false]);

  const handleSnackbarOpen = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  return (
    <Sheet
      variant="outlined"
      sx={{ minHeight: 500, borderRadius: "sm", p: 2, mb: 3 }}
    >
      333
    </Sheet>
  );
}
