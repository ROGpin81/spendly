import { apiFetch } from './api';
import { CategoryStat } from '../models/CategoryStat';

export async function getCategoryStats(token: string): Promise<CategoryStat[]> {
  const data = await apiFetch('/api/stats/categories', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: CategoryStat[] = Object.entries(data).map(([category, total]) => ({
    category,
    total: Number(total),
  }));

  return result;
}