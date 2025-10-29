import ecommerce from '@crema/fakedb/dashboard/ecommerce';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(ecommerce), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
