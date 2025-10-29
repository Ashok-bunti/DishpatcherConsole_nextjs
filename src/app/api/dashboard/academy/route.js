import academy from '@crema/fakedb/dashboard/academy';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(academy), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
