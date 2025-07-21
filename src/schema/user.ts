import { z } from "zod";

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.string(),
  action: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  email: z.any(),
  phone: z.any(),
  roles: z.array(z.string()),
  password: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userInfomationSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  roles: z.array(z.string()),
});

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(permissionSchema),
  created_at: z.string(),
  updated_at: z.string(),
});
