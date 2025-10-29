import { clientList } from '@crema/fakedb/invoice';

let clientsData = clientList;
export const GET = async () => {
  try {
    return new Response(JSON.stringify({ clientsData }), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { client } = reqBody;
    clientsData = [client, ...clientsData];
    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { client } = reqBody;

    clientsData = clientsData.map((item) => {
      if (item.id === client.id) {
        return client;
      }
      return item;
    });
    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
