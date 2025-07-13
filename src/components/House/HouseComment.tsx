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

interface Comment {
  id: number;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

const initialComments: Comment[] = [
  {
    id: 1,
    username: "Alice",
    avatarUrl: "",
    content: "这是一条评论！",
    createdAt: "2025-07-08 15:00",
  },
  {
    id: 2,
    username: "Bob",
    avatarUrl: "",
    content: "你好呀～",
    createdAt: "2025-07-08 16:00",
  },
];

export default function HouseComment() {
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = React.useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      username: "我",
      content: newComment,
      createdAt: new Date().toLocaleString(),
    };
    setComments([comment, ...comments]);
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
        {comments.map((comment) => (
          <Box key={comment.id} mb={3} display="flex">
            <Avatar
              size="sm"
              alt={comment.username}
              src={comment.avatarUrl}
              sx={{ mr: 2 }}
            />
            <Box>
              <Typography level="body-sm" fontWeight="lg">
                {comment.username}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {comment.createdAt}
              </Typography>
              <Typography mt={1}>{comment.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
