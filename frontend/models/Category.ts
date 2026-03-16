export interface Category {
  id: number;
  name: string;
  owner_user_id: number | null;
  created_at?: string;
  updated_at?: string | null;
}