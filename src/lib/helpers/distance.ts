import { Client, Language } from '@googlemaps/google-maps-services-js';
import { z } from 'zod';

import { logger } from '@/lib/logger';

export const convertedWaypointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Waypoint =
  | {
      lat: string;
      lng: string;
    }
  | undefined;

export const calculateDistance = async (
  waypoints: Waypoint[],
  checkHighway?: boolean
): Promise<{
  distance: number;
  hasHighway?: boolean;
}> => {
  const client = new Client({});

  const convertedWaypoints = waypoints.flatMap((point) =>
    point?.lat && point?.lng
      ? [
          {
            lat: Number(point?.lat),
            lng: Number(point?.lng),
          },
        ]
      : []
  );

  try {
    await z.array(convertedWaypointSchema).parseAsync(convertedWaypoints);
    const response = await client.directions({
      params: {
        origin: convertedWaypoints[0], // Start point
        destination: convertedWaypoints[convertedWaypoints.length - 1], // Destination point
        waypoints: convertedWaypoints.slice(1, -1), // waypoints
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        language: Language.pl,
      },
    });

    if (response.status !== 200) {
      logger.error({
        error: `google maps API error response with status: ${response.status}`,
        stack: 'calculateDistance',
      });
      throw new Error(`google maps API error response with status: ${response.status}`);
    }

    const { routes } = response.data;
    if (routes.length > 0) {
      return {
        distance: Number(
          (routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000).toFixed(0)
        ),
        hasHighway: checkHighway
          ? routes[0].legs.some((leg) =>
              leg.steps.some(
                (step) =>
                  step.html_instructions.includes('autostrada') ||
                  step.html_instructions.includes('highway') ||
                  step.html_instructions.includes('toll road') ||
                  step.html_instructions.includes('Droga płatna')
              )
            )
          : undefined,
      };
    } else {
      return {
        distance: 0,
        hasHighway: checkHighway ? false : undefined,
      };
    }
  } catch (error) {
    logger.error({ error, stack: 'calculateDistance' });
    throw new Error((error as Error).message);
  }
};
