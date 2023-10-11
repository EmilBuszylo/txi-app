export interface Operator {
  id: string;
  login: string;
  createdAt: Date;
  operator: {
    id: string;
    name: string;
  } | null;
}
