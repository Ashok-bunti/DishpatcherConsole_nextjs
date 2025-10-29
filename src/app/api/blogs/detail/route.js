import { blogContent, blogSidebar } from '@crema/fakedb/extraPages';

const blogContentData = blogContent;
export const GET = async (request) => {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const { id } = params;
    let blogDetail;
    if (id) blogDetail = blogContentData.find((item) => String(item.id) === id);
    else blogDetail = blogContentData[0];
    return new Response(JSON.stringify({ blogDetail, blogSidebar }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
