export interface CollectionPoint {
  id: string;
  name: string;
  city: string;
  lat: string;
  lng: string;
  fullAddress: string;
  url: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
}
