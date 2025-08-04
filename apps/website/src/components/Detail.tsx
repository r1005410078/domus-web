"use client";
import useEmblaCarousel from "embla-carousel-react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
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
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";
import { List, ListItem, ListItemButton, sheetClasses } from "@mui/joy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import MyLocationTwoToneIcon from "@mui/icons-material/MyLocationTwoTone";
import { ApartmentType, floor_rangeToString, HouseForm } from "@/models/house";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRightRounded";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetHouseDetail } from "@/hooks/useHouse";
import { PhotoProvider, PhotoView } from "react-photo-view";

import "react-photo-view/dist/react-photo-view.css";
import dynamic from "next/dynamic";

import { HomeMap } from "./AMap";

const DynamicCardMapComponent = dynamic(() => import("@/components/CardMap"), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});

// 插件注册
dayjs.extend(utc);
dayjs.extend(timezone);

export interface DetailProps {
  house_id?: string;
  transactionType?: string;
  onClose: () => void;
}

// 房源信息
export default function Detail({
  transactionType,
  house_id,
  onClose,
}: DetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { data: detail } = useGetHouseDetail(house_id);

  const images = useMemo(
    () =>
      detail?.images?.length
        ? detail.images
        : [{ url: "/images/shooting.png" }],
    [detail?.images]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target instanceof HTMLCanvasElement) {
        onClose();
      }
    });
  }, []);

  if (!detail) {
    return <></>;
  }

  return (
    <Card variant="plain" sx={{ border: 0, p: 2 }}>
      <CardContent
        orientation="horizontal"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Box>
          <Typography level="h4" sx={{ fontSize: "1.5rem" }}>
            {detail.title}
          </Typography>
        </Box>
        <IconButton size="lg" variant="plain">
          <CloseTwoToneIcon onClick={() => onClose()} />
        </IconButton>
      </CardContent>
      <CardOverflow>
        <PhotoProvider>
          <div className="embla" ref={emblaRef} style={{ overflow: "hidden" }}>
            <div
              className="embla__container"
              id="lightgallery"
              style={{ display: "flex", height: "260px" }}
            >
              {images.map((image, index) => (
                <div
                  className="embla__slide"
                  style={{
                    flex: "0 0 100%",
                    minWidth: 0,
                    borderRadius: "xs",
                    overflow: "hidden",
                  }}
                >
                  <PhotoView key={index} src={image.url}>
                    <img src={image.url} width={"100%"} alt="" loading="lazy" />
                  </PhotoView>
                </div>
              ))}
            </div>
          </div>
        </PhotoProvider>
      </CardOverflow>
      <CardContent
        orientation="horizontal"
        sx={{ alignItems: "center", mx: -1 }}
      >
        <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => {
              // @ts-ignore
              // 拷贝地址
            }}
          >
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
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => {
              HomeMap.getState().setCenter([
                detail.community?.lng,
                detail.community?.lat,
              ]);
            }}
          >
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
            <Typography level="h4">
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
            <Typography level="h4">
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
            <Typography level="h4">88.0 ㎡</Typography>
            <Typography level="body-md">
              {detail.building_year ?? "未知建筑年限"}/
              {detail.building_structure ?? "塔楼"}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardContent>
        <div>
          <Typography level="h4" color="danger">
            {transactionType === "出售"
              ? detail.sale_price || "--"
              : detail.rent_price || "--"}
            <Typography
              textColor="text.tertiary"
              sx={{ fontSize: "sm", ml: 0.5 }}
            >
              {transactionType === "出售" ? "万元" : "元/月"}
            </Typography>
          </Typography>
        </div>

        <CardContent>
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
          <Accordion defaultExpanded sx={{ p: 0 }}>
            <AccordionSummary>
              <Avatar color="primary">
                <CottageTwoToneIcon />
              </Avatar>
              <ListItemContent>
                <Typography level="title-md">基本信息</Typography>
                <Typography textColor="text.tertiary">
                  🏠 房子的基本信息
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
                    <ListItemContent>交易类型</ListItemContent>
                    <Typography
                      textColor="text.tertiary"
                      sx={{
                        mr: "calc(-1 * var(--ListItem-gap))",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>{detail.transaction_type}</span>
                    </Typography>
                  </ListItemButton>
                </ListItem>
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
                    </Typography>
                  </ListItemButton>
                </ListItem>

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
                      <span>{detail.tags?.filter((t) => !!t).join(" ")}</span>
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
                      <Empty is={!!detail.household}>{detail.household}</Empty>
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
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </CardContent>

      <CardContent>
        <DynamicCardMapComponent community={detail.community} />
      </CardContent>
    </Card>
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

function Empty(props: { children: React.ReactNode; is?: boolean }) {
  if (props.is) {
    return <>{props.children}</>;
  }
  return <>未知</>;
}
