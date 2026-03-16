import { apiFetch } from './api';
import { Movement } from '../models/Movement';

export async function getMovements(token: string): Promise<Movement[]> {
  return await apiFetch('/api/movements', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createMovement(
  token: string,
  data: {
    category_id: number;
    type: 'INGRESO' | 'GASTO';
    amount: number;
    movement_date: string;
    note?: string;
  }
) {
  return await apiFetch('/api/movements', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function updateMovement(
  token: string,
  id: number,
  data: {
    category_id: number;
    type: 'INGRESO' | 'GASTO';
    amount: number;
    movement_date: string;
    note?: string;
  }
) {
  return await apiFetch(`/api/movements/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function deleteMovement(token: string, id: number) {
  return await apiFetch(`/api/movements/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}