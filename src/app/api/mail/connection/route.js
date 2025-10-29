import connectionList from '@crema/fakedb/apps/mail/connectionList';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(connectionList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
