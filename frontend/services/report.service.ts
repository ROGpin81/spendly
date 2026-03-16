import { apiFetch } from './api';
import { MonthlySummary } from '../models/MonthlySummary';

export async function getMonthlySummary(token: string): Promise<MonthlySummary> {
  return await apiFetch('/api/reports/monthly-summary', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}