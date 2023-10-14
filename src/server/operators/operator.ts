export interface Operator {
  id: string;
  login: string;
  createdAt: Date;
  deletedAt?: Date | null;
  operator: {
    id: string;
    name: string;
  } | null;
}
