import { Waypoint } from '@/lib/helpers/distance';

export const generateRouteMapLink = (waypoints: Waypoint[]) => {
  let url = 'https://www.google.com/maps/dir/';

  let count = 0;
  for (const point of waypoints.filter((point) => point?.lat && point?.lng)) {
    if (count > 0) {
      url += '/';
    }

    url += `${point?.lat},+${point?.lng}`;

    count++;
  }

  return url;
};
