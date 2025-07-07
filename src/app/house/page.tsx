"use client";

import House from "@/components/House";
import Header from "@/components/Header";
import Layout from "@/components/layouts/Layout";
import { HouseForm } from "@/models/house";

const defaultValues: HouseForm = {
  purpose: "住宅",
  transaction_type: "出售",
  house_status: "有效",
  owner: {
    name: "taosheng rong:本人",
    description: "",
    phone: "18626891229:本人",
  },
  community: {
    location_id: "B0FFGA9AAU",
    name: "东安花园",
    address: "华中路与港华路交叉口东北100米",
    city: "安庆",
    community_type: "商务住宅;住宅区;住宅小区",
    location_0: 13034149.153408082,
    location_1: 3569425.7594842236,
  },
  sale_price: 12,
  sale_low_price: 11,
  down_payment: 2,
  door_number: {
    building_number: 1,
    unit_number: 1,
    door_number: 1,
  },
  apartment_type: {
    room: 1,
    bathroom: 1,
    kitchen: 1,
    balcony: 1,
  },
};

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <House.Form defaultValues={defaultValues} />
      </Layout.Main>
    </Layout.Root>
  );
}
