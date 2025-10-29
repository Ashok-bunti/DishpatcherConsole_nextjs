import metrics from '@crema/fakedb/dashboard/metrics';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(metrics), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
