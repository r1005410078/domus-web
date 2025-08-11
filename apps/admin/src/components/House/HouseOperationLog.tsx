"use client";
import * as React from "react";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import Typography from "@mui/joy/Typography";
import { useHouseOperationLog } from "@/hooks/useHouse";
import { getHouseOperator } from "../HouseTableConfig";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import UpdateTwoToneIcon from "@mui/icons-material/UpdateTwoTone";
import { useUserList, useUserMap } from "@/hooks/useUser";
import { capitalizeFirstLetter } from "@/utils";
import { Chip, Stack } from "@mui/joy";

export default function HouseOperationLog({ house_id }: { house_id: string }) {
  const { data } = useHouseOperationLog(house_id);
  const userMap = useUserMap();

  return (
    <Stepper orientation="vertical">
      {getHouseOperator(data || []).map((item, index) => {
        return (
          <Step orientation="vertical">
            <div>
              <Typography
                level="title-sm"
                startDecorator={
                  item.operation_type === 1 ? (
                    <PersonAddTwoToneIcon />
                  ) : (
                    <UpdateTwoToneIcon />
                  )
                }
              >
                {capitalizeFirstLetter(
                  userMap?.get(item.operator_id)?.username || ""
                )}{" "}
                {/* {item.title} */}
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  alignItems: "flex-start",
                  wordBreak: "break-all",
                  lineHeight: 2,
                  fontSize: "12px",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: "wrap" }}
                >
                  {item.content
                    .split(",")
                    .filter(Boolean)
                    .map((item, index) => (
                      <Chip size="sm" key={index}>
                        {item}
                      </Chip>
                    ))}
                </Stack>
              </Typography>

              <Typography
                level="body-sm"
                sx={{
                  alignItems: "flex-start",
                  maxWidth: 240,
                  wordBreak: "break-all",
                  fontSize: "12px",
                }}
              >
                {item.time}
              </Typography>
            </div>
          </Step>
        );
      })}
    </Stepper>
  );
}
