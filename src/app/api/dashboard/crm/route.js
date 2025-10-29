import crm from '@crema/fakedb/dashboard/crm';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(crm), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
