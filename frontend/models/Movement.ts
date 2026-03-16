export interface Movement {
  id: number;
  user_id: number;
  category_id: number;
  type: 'INGRESO' | 'GASTO';
  amount: string;
  movement_date: string;
  note?: string | null;
  location_lat?: string | null;
  location_lng?: string | null;
  created_at?: string;
  updated_at?: string | null;
}