import { z } from 'zod';

export interface Order {
  id: string;
  internalId: string;
  externalId: string | null;
  locationFrom: z.infer<typeof locationFromSchema>;
  locationVia?: z.infer<typeof locationFromSchema>[];
  locationTo: z.infer<typeof locationToSchema>;
  estimatedDistance?: number;
  wayBackDistance?: number;
  hasHighway?: boolean;
  status: OrderStatus;
  driverInvoice?: string;
  clientInvoice?: string;
  clientName: string;
  driver?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  collectionPoint?: {
    fullAddress: string;
    name: string;
  };
  comment?: string;
  updatedAt: Date;
  createdAt: Date;
}

export enum OrderStatus {
  NEW = 'NEW',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const locationFromSchema = z.object({
  date: z.string(),
  address: z.object({
    fullAddress: z.string(),
    city: z.string(),
    lat: z.string(),
    lng: z.string(),
    url: z.string(),
  }),
  passenger: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
  }),
});

export const locationToSchema = z.object({
  date: z.string(),
  address: z.object({
    fullAddress: z.string(),
    city: z.string(),
    lat: z.string(),
    lng: z.string(),
    url: z.string(),
  }),
});
