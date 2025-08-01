"use client";

import { useUserProfile } from "@/hooks/useLogin";
import { useUserInfomation } from "@/hooks/useUser";
import { capitalizeFirstLetter } from "@/utils";
import { Avatar, Badge, badgeClasses, Box, Typography } from "@mui/joy";

export interface UserAvatarProps {
  userId?: string;
}

export function UserAvatar({ userId }: UserAvatarProps) {
  const { userProfile, avatarURL, avatarName } = useUserProfile();
  const { data: user } = useUserInfomation(userId);
  let userInfo = userProfile;
  if (user) {
    userInfo = user;
  }

  if (!userInfo) {
    return null;
  }

  let avatarNode;
  if (avatarURL) {
    avatarNode = <Avatar src={avatarURL} sx={{ borderRadius: "50%" }} />;
  }

  const name = userInfo!.username?.[0]?.toUpperCase() || "R";
  avatarNode = <Avatar>{name}</Avatar>;

  return (
    <Badge
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeInset="14%"
      color="success"
      size="sm"
      sx={{
        [`& .${badgeClasses.badge}`]: {
          "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "2px solid",
            borderColor: "success.500",
            content: '""',
          },
        },
        "@keyframes ripple": {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(2)",
            opacity: 0,
          },
        },
      }}
    >
      {avatarNode}
    </Badge>
  );
}

export function UserInfomation({ userId }: UserAvatarProps) {
  const { userProfile, avatarURL, avatarName } = useUserProfile();
  const { data: user } = useUserInfomation(userId);
  let userInfo = userProfile;
  if (user) {
    userInfo = user;
  }

  if (!userInfo) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <UserAvatar />
      <Box sx={{ ml: 1.5 }}>
        <Typography level="title-sm" textColor="text.primary">
          {capitalizeFirstLetter(userInfo!.username)}
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary">
          {userInfo!.phone}
        </Typography>
      </Box>
    </Box>
  );
}
