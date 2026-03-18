export interface MapExpense {
  id: number;
  amount: number;
  type: 'INGRESO' | 'GASTO';
  movement_date: string;
  note?: string | null;
  location_lat: number;
  location_lng: number;
  category: {
    id: number;
    name: string;
  } | null;
}