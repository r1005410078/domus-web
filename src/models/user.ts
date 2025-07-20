export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  source: string;
  action: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  username: string;
  email: any;
  phone: any;
  // 角色
  roles: string[];
  password?: string;
  created_at: string;
  updated_at: string;
}
