import { apiFetch } from './api';
import { AdminSummary } from '../models/AdminSummary';
import { AdminTopUser } from '../models/AdminTopUser';

export async function getAdminSummary(token: string): Promise<AdminSummary> {
  const data = await apiFetch('/api/admin/summary', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.summary;
}

export async function getAdminTopUsers(token: string): Promise<AdminTopUser[]> {
  const data = await apiFetch('/api/admin/top-users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.top_users ?? [];
}