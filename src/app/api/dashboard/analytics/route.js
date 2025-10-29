import analytics from '@crema/fakedb/dashboard/analytics';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(analytics), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
