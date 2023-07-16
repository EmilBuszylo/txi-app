export interface Driver {
  id: string;
  login: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  updatedAt: Date;
}
