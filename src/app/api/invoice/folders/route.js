import folderList from '@crema/fakedb/invoice/folderList';

export const GET = async () => {
  try {
    return new Response(JSON.stringify({ folderList }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
