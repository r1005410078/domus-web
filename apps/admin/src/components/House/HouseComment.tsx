import * as React from "react";
import {
  Box,
  Avatar,
  Typography,
  Textarea,
  Button,
  Card,
  Stack,
} from "@mui/joy";
import { useAddComment, useCommentList } from "@/hooks/useHouse";
import { dateToString } from "@/models/house";
import { capitalizeFirstLetter } from "@/utils";

export interface Comment {
  id: number;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface HouseCommentProps {
  houseId: string;
}

export default function HouseComment({ houseId }: HouseCommentProps) {
  const [newComment, setNewComment] = React.useState("");
  const { mutate } = useAddComment();
  const { data: comments } = useCommentList(houseId);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    mutate({ house_id: houseId, comment: newComment });
    setNewComment("");
  };

  return (
    <Card variant="plain" sx={{ width: "100%", margin: "auto", p: 0 }}>
      <Typography level="h4" gutterBottom>
        评论
      </Typography>

      <Stack spacing={2}>
        <Textarea
          placeholder="写下你的评论..."
          minRows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleSubmit}>提交</Button>
      </Stack>

      <Box mt={4}>
        {comments?.map((comment) => (
          <Box key={comment.id} mb={3} display="flex">
            <Avatar
              size="sm"
              alt={comment.admin_id.toLocaleUpperCase()}
              src={comment.admin_id[0]!.toLocaleUpperCase()}
              sx={{ mr: 2 }}
            />
            <Box>
              <Typography level="body-sm" fontWeight="lg">
                {capitalizeFirstLetter(comment.admin_id)}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {dateToString(comment.updated_at)}
              </Typography>
              <Typography mt={1}>{comment.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
