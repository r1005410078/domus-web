"use client";

import Header from "@/components/Header";
import House from "@/components/House";
import Layout from "@/components/layouts/Layout";
import { CssBaseline, CssVarsProvider } from "@mui/joy";

export default function Page() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Layout.Root>
        <Layout.Header>
          <Header />
        </Layout.Header>
        <Layout.Main>
          <House.Detail />
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}
