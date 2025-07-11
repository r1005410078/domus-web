"use client";
import useEmblaCarousel from "embla-carousel-react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import ListItemContent from "@mui/joy/ListItemContent";
import CottageTwoToneIcon from "@mui/icons-material/CottageTwoTone";
import HistoryEduTwoToneIcon from "@mui/icons-material/HistoryEduTwoTone";
import RateReviewTwoToneIcon from "@mui/icons-material/RateReviewTwoTone";

import {
  Dropdown,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuButton,
  MenuItem,
  sheetClasses,
} from "@mui/joy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import MyLocationTwoToneIcon from "@mui/icons-material/MyLocationTwoTone";
import { ApartmentType, FloorRange, HouseForm } from "@/models/house";
import dayjs from "dayjs";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRightRounded";
import UpdateHouse from "./UpdateHouse";
import HouseComment from "./HouseComment";

export interface DetailProps {
  detail: HouseForm;
  transactionType?: string;
}

// 房源信息
export function Detail(props: DetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { transactionType, detail } = props;
  const images = useMemo(
    () => detail.images || [{ url: "/images/shooting.jpg" }],
    [detail.images]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

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
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ ml: "auto" }}
              slotProps={{ root: { variant: "plain", color: "neutral" } }}
            >
              <MoreHoriz />
            </MenuButton>
            <Menu>
              <MenuItem>编辑</MenuItem>
            </Menu>
          </Dropdown>
        </CardContent>
        <CardOverflow>
          <div className="embla" ref={emblaRef} style={{ overflow: "hidden" }}>
            <div
              className="embla__container"
              style={{ display: "flex", height: "260px" }}
            >
              {images.map((image, index) => (
                <div
                  className="embla__slide"
                  style={{ flex: "0 0 100%", minWidth: 0 }}
                >
                  <AspectRatio>
                    <img src={image.url} alt="" loading="lazy" />
                  </AspectRatio>
                </div>
              ))}
            </div>
          </div>
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
              <ShareTwoToneIcon />
            </IconButton>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: "auto" }}
          >
            {[...Array(images.length)].map((_, index) => (
              <Box
                key={index}
                sx={[
                  {
                    borderRadius: "50%",
                    width: `max(${6 - index}px, 3px)`,
                    height: `max(${6 - index}px, 3px)`,
                  },
                  index === selectedIndex
                    ? { bgcolor: "primary.solidBg" }
                    : { bgcolor: "background.level3" },
                ]}
              />
            ))}
          </Box>
          <Box sx={{ width: 0, display: "flex", flexDirection: "row-reverse" }}>
            <IconButton variant="plain" color="neutral" size="sm">
              <MyLocationTwoToneIcon />
            </IconButton>
          </Box>
        </CardContent>

        <CardContent>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography level="h3">
                {apartmentTypeToString(detail.apartment_type) || "未知户型"}
              </Typography>
              <Typography level="body-md">
                {floor_rangeToString(detail.floor_range)}
              </Typography>
            </Stack>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography level="h3">
                {detail.house_orientation ?? "朝向未知"}
              </Typography>
              <Typography level="body-md">
                {detail.house_decoration ?? "装修未知"}
              </Typography>
            </Stack>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography level="h3">88.0 ㎡</Typography>
              <Typography level="body-md">
                {detail.building_year ?? "未知建筑年限"}/
                {detail.building_structure ?? "塔楼"}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>

        <CardContent>
          <div>
            <Typography level="h3" color="danger">
              {transactionType === "出售"
                ? detail.sale_price
                : detail.rent_price}
              <Typography
                textColor="text.tertiary"
                sx={{ fontSize: "sm", ml: 0.5 }}
              >
                {transactionType === "出售" ? "万元" : "元/月"}
              </Typography>
            </Typography>
          </div>

          <CardContent>
            <Typography level="title-lg">{detail.title}</Typography>
            <Typography level="body-md">
              {detail.community?.name} {detail.community?.address}
            </Typography>
            <Typography
              level="body-md"
              sx={{ fontFamily: "monospace", opacity: "70%" }}
            >
              {detail.remark}
            </Typography>
          </CardContent>
          <Link
            component="button"
            underline="none"
            sx={{ fontSize: "10px", color: "text.tertiary", my: 0.5 }}
          >
            <span>更新于</span>
            <span style={{ marginLeft: "4px" }}>
              {dayjs
                .utc(detail.updated_at)
                .tz("Asia/Shanghai")
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
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
                  <CottageTwoToneIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">基本信息</Typography>
                  <Typography textColor="text.tertiary">
                    业主/售价/小区
                  </Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <List
                  sx={{
                    [`& .${sheetClasses.root}`]: {
                      p: 0.5,
                      lineHeight: 0,
                      borderRadius: "sm",
                    },
                  }}
                >
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>用途</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>{detail.purpose}</span>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>业主姓名</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.owner?.name}>
                          {detail.owner?.name}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>联系方式</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.owner?.phone}
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>售价</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.sale_price}
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>出售低价</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.sale_low_price} 万元
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>租价</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.rent_price} 元/月
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>出租低价</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.rent_low_price} 元/月
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>首付</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.down_payment}>
                          {detail.down_payment} 万元
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>小区</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.community?.name}
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>地址</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {detail.community?.address}
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>门牌号</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {" "}
                          {detail.door_number?.building_number}号楼
                          {detail.door_number?.unit_number}单元
                          {detail.door_number?.door_number}室
                        </span>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>户型</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {apartmentTypeToStringFull(detail.apartment_type)}
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary>
                <Avatar color="success">
                  <ImportContactsTwoToneIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">详细信息</Typography>
                  <Typography textColor="text.tertiary">
                    房屋装修/建筑面积/朝向/楼层/学位
                  </Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>楼层</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty
                          is={
                            !!detail.floor_range?.door_number_from &&
                            !!detail.floor_range?.door_number_to
                          }
                        >
                          {detail.floor_range?.door_number_from ?? 0}到
                          {detail.floor_range?.door_number_to ?? 0}层
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>推荐标签</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>{detail.tags?.join(" ")}</span>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>车位高度</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.car_height}>
                          {detail.car_height}米
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>梯户</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty
                          is={!!detail.stairs?.stairs && !!detail.stairs?.rooms}
                        >
                          {detail.stairs?.stairs}梯{detail.stairs?.rooms}户
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>实率</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.actual_rate}>
                          {detail.actual_rate}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>级别</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.level}>{detail.level}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>层高</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.floor_height}>
                          {detail.floor_height}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>进深</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.progress_depth}>
                          {detail.progress_depth}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>门宽</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.door_width}>
                          {detail.door_width}米
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>建筑面积</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.building_area}>
                          {detail.building_area}平米
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>使用面积</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.use_area}>
                          {detail.use_area}平米
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>房屋类型</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.house_type}>
                          {detail.house_type}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>朝向</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.house_orientation}>
                          {detail.house_orientation}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>装修</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.house_decoration}>
                          {detail.house_decoration}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>满减年限</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.discount_year_limit}>
                          {detail.discount_year_limit}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>看房方式</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.view_method}>
                          {detail.view_method}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>付款方式</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.payment_method}>
                          {detail.payment_method}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>房源税费</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.property_tax}>
                          {detail.property_tax}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>建筑结构</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.building_structure}>
                          {detail.building_structure}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>产权性质</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.property_rights}>
                          {detail.property_rights}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>产权年限</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.property_year_limit}>
                          {detail.property_year_limit}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>产证日期</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.certificate_date}>
                          {detail.certificate_date}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>交房日期</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.handover_date}>
                          {detail.handover_date}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>学位</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.degree}>{detail.degree}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>户口</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.household}>
                          {detail.household}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>来源</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.source}>{detail.source}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>唯一住房</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.unique_housing}>
                          {detail.unique_housing}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>全款</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.full_payment}>
                          {detail.full_payment}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>抵押</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.mortgage}>{detail.mortgage}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>急切</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.urgent}>{detail.urgent}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>配套</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.support}>{detail.support}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>现状</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.present_state}>
                          {detail.present_state}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent>外网同步</ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.external_sync}>
                          {detail.external_sync}
                        </Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton>
                      <ListItemContent sx={{ width: 150 }}>
                        备注
                      </ListItemContent>
                      <Typography
                        textColor="text.tertiary"
                        sx={{
                          mr: "calc(-1 * var(--ListItem-gap))",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Empty is={!!detail.remark}>{detail.remark}</Empty>
                        <KeyboardArrowRight />
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary>
                <Avatar color="primary">
                  <RateReviewTwoToneIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">房源追踪</Typography>
                  <Typography textColor="text.tertiary">
                    房源用户最近动态追踪
                  </Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <HouseComment />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary>
                <Avatar color="primary">
                  <HistoryEduTwoToneIcon />
                </Avatar>
                <ListItemContent>
                  <Typography level="title-md">历史记录</Typography>
                  <Typography textColor="text.tertiary">修改记录</Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                <UpdateHouse />
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
        </CardContent>
      </Card>
    </Box>
  );
}

function apartmentTypeToString(data?: ApartmentType) {
  let str = "";

  if (data?.room) {
    str += `${data.room}室`;
  }

  if (data?.hall) {
    str += `${data.hall}厅`;
  }

  if (data?.bathroom) {
    str += `${data.bathroom}卫`;
  }

  return str;
}

function apartmentTypeToStringFull(data?: ApartmentType) {
  let str = "";

  if (data?.room) {
    str += `${data.room}室`;
  }

  if (data?.hall) {
    str += `${data.hall}厅`;
  }

  if (data?.bathroom) {
    str += `${data.bathroom}卫`;
  }

  if (data?.kitchen) {
    str += `${data.kitchen}厨`;
  }

  if (data?.terrace) {
    str += `${data.terrace}阳台`;
  }

  return str;
}

function floor_rangeToString(data?: FloorRange) {
  let sum = (data?.door_number_to ?? 0) - (data?.door_number_from ?? 0);
  let str = "";

  if (data?.floor_type) {
    str += `${data.floor_type}`;
  } else {
    str += `中间楼层`;
  }

  if (sum > 0) {
    str += `/${sum}层`;
  } else {
    str += `/楼层未知`;
  }

  return str;
}

function Empty(props: { children: React.ReactNode; is?: boolean }) {
  if (props.is) {
    return <>{props.children}</>;
  }
  return <>未知</>;
}
