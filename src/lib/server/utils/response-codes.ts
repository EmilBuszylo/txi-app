import { NextApiResponse } from 'next';

export const apiNoRouteResponse = (res: NextApiResponse) => {
  return res.status(404).json({
    code: 'rest_no_route',
    message: 'No route was found matching the URL and request method.',
    data: {
      status: 404,
    },
  });
};
