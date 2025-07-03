"use client";

import House from "@/components/House";
import Header from "@/components/Header";
import Layout from "@/components/layouts/Layout";

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <House.Form />
      </Layout.Main>
    </Layout.Root>
  );
}
