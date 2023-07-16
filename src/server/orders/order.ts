export interface Order {
  id: string;
  internalId: string;
  externalId: string | null;
  updatedAt: Date;
  createdAt: Date;
}
