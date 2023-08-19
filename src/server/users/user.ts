export interface User {
  id: string;
  login: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
}
