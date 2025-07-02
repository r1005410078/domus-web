"use client";

import {
  OpenInNew,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlined from "@mui/icons-material/ModeCommentOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Switch from "@mui/joy/Switch";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ListItemContent from "@mui/joy/ListItemContent";

import AirplanemodeActiveRoundedIcon from "@mui/icons-material/AirplanemodeActiveRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import BluetoothRoundedIcon from "@mui/icons-material/BluetoothRounded";
import TapAndPlayRoundedIcon from "@mui/icons-material/TapAndPlayRounded";
import EditNotificationsRoundedIcon from "@mui/icons-material/EditNotificationsRounded";
import AdUnitsRoundedIcon from "@mui/icons-material/AdUnitsRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import SpatialTrackingRoundedIcon from "@mui/icons-material/SpatialTrackingRounded";
import SettingsVoiceRoundedIcon from "@mui/icons-material/SettingsVoiceRounded";

export interface DetailProps {}
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);
// 房源信息
export function Detail(props: DetailProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.surface",
        width: { xs: "none", sm: "400px" },
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        border: 1,
        borderColor: "divider",
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        borderRadius: "sm",
        position: "relative",
        top: "0px",
      }}
    >
      <Card
        variant="outlined"
        sx={{ "--Card-radius": (theme) => theme.vars.radius.xs, border: 0 }}
      >
        <CardContent
          orientation="horizontal"
          sx={{ alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                m: "-2px",
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              },
            }}
          >
            <Avatar
              size="sm"
              src="/static/logo.png"
              sx={{
                p: 0.5,
                border: "2px solid",
                borderColor: "background.body",
              }}
            />
          </Box>
          <Typography sx={{ fontWeight: "lg" }}>MUI</Typography>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ ml: "auto" }}
          >
            <MoreHoriz />
          </IconButton>
        </CardContent>
        <CardOverflow>
          <AspectRatio>
            <img src="/images/house.png" alt="" loading="lazy" />
          </AspectRatio>
        </CardOverflow>
        <CardContent
          orientation="horizontal"
          sx={{ alignItems: "center", mx: -1 }}
        >
          <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
            <IconButton variant="plain" color="neutral" size="sm">
              <FavoriteBorder />
            </IconButton>
            <IconButton variant="plain" color="neutral" size="sm">
              <ModeCommentOutlined />
            </IconButton>
            <IconButton variant="plain" color="neutral" size="sm">
              <SendOutlined />
            </IconButton>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: "auto" }}
          >
            {[...Array(5)].map((_, index) => (
              <Box
                key={index}
                sx={[
                  {
                    borderRadius: "50%",
                    width: `max(${6 - index}px, 3px)`,
                    height: `max(${6 - index}px, 3px)`,
                  },
                  index === 0
                    ? { bgcolor: "primary.solidBg" }
                    : { bgcolor: "background.level3" },
                ]}
              />
            ))}
          </Box>
          <Box sx={{ width: 0, display: "flex", flexDirection: "row-reverse" }}>
            <IconButton variant="plain" color="neutral" size="sm">
              <BookmarkBorderRoundedIcon />
            </IconButton>
          </Box>
        </CardContent>
        <CardContent>
          <div>
            <Typography level="h3">
              ¥58
              <Typography textColor="text.tertiary" sx={{ fontSize: "sm" }}>
                /月
              </Typography>
            </Typography>
          </div>
          <CardContent>
            <Typography level="title-lg">
              宣陵站 德黑兰大宇I-Ville 3号 两室全选项短期出租
            </Typography>
            <Typography level="body-md">
              现有租户，2025年12月到期，可转让，可进行小额投资。租户姓名可转让，因此可实际入住。由于周边地区正在逐步开发，该房产具有良好的投资价值。此照片与出售时的实际房产相同。
            </Typography>
          </CardContent>
          <Link
            component="button"
            underline="none"
            sx={{ fontSize: "10px", color: "text.tertiary", my: 0.5 }}
          >
            2 天前更新
          </Link>
        </CardContent>

        <CardContent orientation="horizontal" sx={{ gap: 1 }}>
          <AccordionGroup
            variant="plain"
            transition="0.2s"
            sx={{
              borderRadius: "md",
              [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                {
                  paddingBlock: "1rem",
                },
              [`& .${accordionSummaryClasses.button}`]: {
                paddingBlock: "1rem",
              },
            }}
          >
            <Accordion>
              <AccordionSummary>
                <Avatar color="primary">
                  <TapAndPlayRoundedIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">房源信息</Typography>
                  <Typography level="body-sm">
                    精装，商品房，住宅，南北
                  </Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <AirplanemodeActiveRoundedIcon
                      sx={{ mx: 1, fontSize: "xl2" }}
                    />
                    <FormLabel>Airplane Mode</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <WifiRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Wi-Fi</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <BluetoothRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Bluetooth</FormLabel>
                    <Switch size="sm" />
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary>
                <Avatar color="success">
                  <EditNotificationsRoundedIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">小区信息</Typography>
                  <Typography level="body-sm">回祥小区 2022年建成</Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <EmailRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>E-mail</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <MessageRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Messages</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <AdUnitsRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Push</FormLabel>
                    <Switch size="sm" />
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary>
                <Avatar color="danger">
                  <AccessibilityNewRoundedIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">跟进信息</Typography>
                  <Typography level="body-sm">没有跟进信息</Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <ZoomInRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Zoom</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <SpatialTrackingRoundedIcon
                      sx={{ mx: 1, fontSize: "xl2" }}
                    />
                    <FormLabel>Audio Descriptions</FormLabel>
                    <Switch size="sm" />
                  </FormControl>

                  <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                    <SettingsVoiceRoundedIcon sx={{ mx: 1, fontSize: "xl2" }} />
                    <FormLabel>Voice Control</FormLabel>
                    <Switch size="sm" />
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
        </CardContent>
      </Card>
    </Box>
  );
}
