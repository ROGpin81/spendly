export interface Movement {
  id: number;
  user_id: number;
  category_id: number;
  type: 'INGRESO' | 'GASTO';
  amount: string;
  movement_date: string;
  note?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  created_at?: string;
  updated_at?: string | null;
}