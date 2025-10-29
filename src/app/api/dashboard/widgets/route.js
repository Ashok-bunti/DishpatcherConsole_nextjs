import widgets from '@crema/fakedb/dashboard/widgets';

export const GET = async (request) => {
  try {
    return new Response(JSON.stringify(widgets), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
