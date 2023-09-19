import z from '@/lib/helpers/zod/zod';

export interface Order {
  id: string;
  internalId: string;
  externalId: string;
  locationFrom: LocationFrom;
  locationVia?: LocationFrom[];
  locationTo: LocationTo;
  estimatedDistance?: number;
  wayBackDistance?: number;
  actualKm?: number;
  hasHighway?: boolean;
  highwaysCost?: string;
  status: OrderStatus;
  driverInvoice?: string;
  clientInvoice?: string;
  isPayed?: boolean;
  kmForDriver?: number;
  clientId: string;
  clientName: string;
  intakeDistance?: number;
  isKmDifferenceAccepted?: boolean;
  stopTime?: number;
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    operatorName?: string;
  };
  collectionPoint?: {
    id: string;
    fullAddress: string;
    name: string;
    lat: string;
    lng: string;
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
  date: z.string().optional(),
  address: z.object({
    fullAddress: z.string(),
    city: z.string(),
    lat: z.string(),
    lng: z.string(),
    url: z.string(),
  }),
  passenger: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string(),
    phone: z.string().min(1, 'Numer kontaktowy jest wymagany'),
    additionalPassengers: z
      .array(
        z.object({
          name: z.string().optional(),
        })
      )
      .max(3)
      .optional()
      .nullable(),
  }),
});

export const locationToSchema = z.object({
  date: z.string().optional(),
  address: z.object({
    fullAddress: z.string(),
    city: z.string(),
    lat: z.string(),
    lng: z.string(),
    url: z.string(),
  }),
});

export type LocationFrom = z.infer<typeof locationFromSchema>;
export type LocationTo = z.infer<typeof locationToSchema>;
