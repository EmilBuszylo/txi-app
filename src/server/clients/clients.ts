export interface Client {
  id: string;
  name: string;
  fullName?: string | null;
  deletedAt: string;
  updatedAt: Date;
  createdAt: Date;
}
