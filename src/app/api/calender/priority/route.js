import priorityList from '@crema/fakedb/apps/todo/priorityList';

export const GET = async (request) => {
  try {
    return new Response(JSON.stringify(priorityList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
