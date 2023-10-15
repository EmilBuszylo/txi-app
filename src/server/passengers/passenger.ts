export interface Passenger {
  id: string;
  name: string;
  phones: string[];
  clients: { id: string }[];
  createdAt: Date;
  deletedAt: Date | null;
}
