import { wallData } from '@crema/fakedb/apps/wall';

export const GET = async (request) => {
  try {
    return new Response(JSON.stringify(wallData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
