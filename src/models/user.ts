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
