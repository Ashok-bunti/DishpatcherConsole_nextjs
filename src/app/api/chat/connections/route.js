import connectionList from '@crema/fakedb/apps/chat/connectionList';

let connectionData = connectionList;

export const GET = async (request) => {
  try {
    return new Response(JSON.stringify(connectionData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
