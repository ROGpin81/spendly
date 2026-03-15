import { apiFetch } from './api';
import { Category } from '../models/Category';

export async function getCategories(token: string): Promise<Category[]> {
  return await apiFetch('/api/categories', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createCategory(token: string, name: string) {
  console.log('createCategory token:', token);
  console.log('createCategory name:', name);

  return await apiFetch('/api/categories', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(token: string, id: number, name: string) {
  return await apiFetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(token: string, id: number) {
  return await apiFetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}