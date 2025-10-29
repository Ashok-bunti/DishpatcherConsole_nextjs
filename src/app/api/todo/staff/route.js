import { staffList } from '@crema/fakedb/apps/todo/staffList';

export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(staffList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
