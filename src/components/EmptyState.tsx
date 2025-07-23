import { Typography, Box } from "@mui/joy";
import InboxIcon from "@mui/icons-material/Inbox"; // 或你喜欢的图标

interface EmptyStateProps {
  isEmpty: boolean;
  children: React.ReactNode;
}

export function EmptyState({ isEmpty, children }: EmptyStateProps) {
  if (!isEmpty) return children;

  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        color: "neutral.700",
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 1, color: "primary.500" }} />
      <Typography level="title-md" sx={{ color: "neutral.800" }}>
        这里空空如也~
      </Typography>
      <Typography level="body-sm" sx={{ mt: 1, color: "neutral.600" }}>
        暂无可显示的数据
      </Typography>
    </Box>
  );
}
