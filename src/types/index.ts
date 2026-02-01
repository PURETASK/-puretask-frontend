export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'cleaner' | 'admin';
  avatar?: string;
}
