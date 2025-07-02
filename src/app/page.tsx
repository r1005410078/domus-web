"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";

import NavBar from "@/components/rental-dashbord/NavBar";
import RentalCard, {
  NavMenuButton,
} from "@/components/rental-dashbord/RentalCard";
import HeaderSection from "@/components/rental-dashbord/HeaderSection";
import Search from "@/components/rental-dashbord/Search";
import Filters from "@/components/rental-dashbord/Filters";
import Pagination from "@/components/rental-dashbord/Pagination";
import { MapPage } from "@/components/AMap";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/Header";
import House from "@/components/House";
import { List, ListItem, Menu } from "@mui/joy";

export default function RentalDashboard() {
  const [menu, setMenu] = React.useState<null | string>(null);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Box
        component="main"
        sx={{
          height: "calc(100vh - 55px)", // 55px is the height of the NavBar
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "430px auto" },
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Box />
        <Box
          sx={{
            gridRow: "span 3",
            display: { xs: "none", md: "flex" },
          }}
        >
          <MapPage />
        </Box>
        <Stack spacing={2} sx={{ px: { xs: 1, md: 2 }, pt: 2, minHeight: 0 }}>
          <Filters />
          <List
            sx={{
              "--List-gap": "12px",
              overflow: "auto",
            }}
          >
            <ListItem sx={{ p: 0 }}>
              <NavMenuButton
                menu={
                  <Menu>
                    <House.Detail />
                  </Menu>
                }
                open={menu === "1"}
                onOpen={() => setMenu("1")}
                label="11"
              >
                <RentalCard
                  onClick={() => setMenu("1")}
                  title="A Stylish Apt, 5 min walk to Queen Victoria Market"
                  category="Entire apartment rental in Collingwood"
                  rareFind
                  image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400"
                />
              </NavMenuButton>
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <RentalCard
                title="Designer NY style loft"
                category="Entire loft in central business district"
                liked
                image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400"
              />
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <RentalCard
                title="5 minute walk from University of Melbourne"
                category="Entire rental unit in Carlton"
                image="https://images.unsplash.com/photo-1537726235470-8504e3beef77?auto=format&fit=crop&w=400"
              />
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <RentalCard
                title="Magnificent apartment next to public transport"
                category="Entire apartment rental in Collingwood"
                image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400"
              />
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <RentalCard
                title="Next to shoppng mall and public transport"
                category="Entire apartment rental in Collingwood"
                image="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400"
              />
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <NavMenuButton
                menu={
                  <Menu>
                    <House.Detail />
                  </Menu>
                }
                open={menu === "2"}
                onOpen={() => setMenu("2")}
                label="11"
              >
                <RentalCard
                  title="Endless ocean view"
                  category="A private room in a shared apartment in Docklands"
                  image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400"
                />
              </NavMenuButton>
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <RentalCard
                title="A Stylish Apt, 5 min walk to Queen Victoria Market"
                category="one bedroom apartment in Collingwood"
                image="https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=400"
              />
            </ListItem>
          </List>
        </Stack>
        <Pagination />
      </Box>
    </CssVarsProvider>

    // <CssVarsProvider disableTransitionOnChange>
    //   <CssBaseline />
    //   <Layout.Root>
    //     <Layout.Header>
    //       <Header />
    //     </Layout.Header>
    //     <Layout.Main>
    //       <House.Detail />
    //     </Layout.Main>
    //   </Layout.Root>
    // </CssVarsProvider>
  );
}
