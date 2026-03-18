import { apiFetch } from './api';
import { MapExpense } from '../models/MapExpense';

export async function getMapExpenses(token: string): Promise<MapExpense[]> {
  const data = await apiFetch('/api/map/expenses', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.expenses ?? [];
}