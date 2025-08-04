"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={30}
          height={30}
          style={{ borderRadius: 30 }}
        />
        <Button
          variant="plain"
          color="neutral"
          component="a"
          aria-pressed={pathname.indexOf("/house/sold") === 0}
          href="/house/sold"
          size="lg"
          sx={{ alignSelf: "center" }}
        >
          二手房
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/house/rent"
          aria-pressed={pathname.indexOf("/house/rent") === 0}
          size="lg"
          sx={{ alignSelf: "center" }}
        >
          租房
        </Button>
      </Stack>
    </Box>
  );
}
