import { apiFetch } from './api';

export async function registerUser(data: {
  username: string;
  password: string;
  full_name: string;
}) {
  return await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  return await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string) {
  return await apiFetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}