export interface AdminTopUser {
  user_id: number;
  username: string | null;
  full_name: string | null;
  total_spent: number;
  movements_count: number;
}