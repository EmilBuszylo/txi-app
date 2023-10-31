import z from '@/lib/helpers/zod/zod';

export interface Order {
  id: string;
  internalId: string;
  externalId: string;
  locationFrom: LocationFrom;
  locationVia?: LocationVia[];
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
  operatorNote?: string | null;
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
    name: z.any().optional().nullable(),
    phone: z.any().optional().nullable(),
    additionalPassengers: z
      .array(
        z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          type: z.string().optional(),
        })
      )
      .min(1, 'Musisz dodać przynajmniej jednego pasażera do miejsca odbioru')
      .max(3)
      .refine(
        (elements) => {
          return elements.some((el) => el.phone);
        },
        { message: 'Numer kontaktowy pierwszego pasażera jest wymagany' }
      )
      .optional()
      .nullable(),
  }),
});

export const locationViaPointSchema = locationFromSchema.extend({
  passenger: z
    .object({
      name: z.any().optional().nullable(),
      phone: z.any().optional().nullable(),
      additionalPassengers: z
        .array(
          z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            type: z.string().optional(),
          })
        )
        .max(3)
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
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
export type LocationVia = z.infer<typeof locationViaPointSchema>;
export type LocationTo = z.infer<typeof locationToSchema>;
