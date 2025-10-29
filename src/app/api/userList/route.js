import userList from '@crema/fakedb/userList';

export const GET = async () => {
  try {
    return new Response(JSON.stringify(userList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
