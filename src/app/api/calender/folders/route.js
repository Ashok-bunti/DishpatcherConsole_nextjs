import folderList from '@crema/fakedb/apps/todo/folderList';

export const GET = async (request) => {
  try {
    return new Response(JSON.stringify(folderList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
