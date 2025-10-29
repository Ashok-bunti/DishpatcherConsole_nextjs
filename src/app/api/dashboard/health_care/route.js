import healthCareData from '@crema/fakedb/dashboard/healthCare';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(healthCareData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
