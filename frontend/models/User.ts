export interface User {
  id: number;
  username: string;
  full_name: string;
  role: 'ADMIN' | 'USER';
}