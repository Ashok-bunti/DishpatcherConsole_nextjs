import crypto from '@crema/fakedb/dashboard/crypto';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(crypto), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
