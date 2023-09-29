export interface Driver {
  id: string;
  login: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  operatorId?: string | null;
  operatorName?: string | null;
  createdAt: Date;
  driverDetails?: {
    carModel?: string | null;
    carBrand?: string | null;
    carColor?: string | null;
    carRegistrationNumber?: string | null;
  } | null;
  deletedAt: Date | null;
}
