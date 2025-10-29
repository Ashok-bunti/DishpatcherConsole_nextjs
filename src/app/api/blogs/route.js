import { blogContent, blogSidebar } from '@crema/fakedb/extraPages';

let blogContentData = blogContent;

export const GET = async () => {
  try {
    return new Response(
      JSON.stringify({ blogContent: blogContentData, blogSidebar }),
      { status: 200 },
    );
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { blog } = reqBody;
    blogContentData.push(blog);
    return new Response(JSON.stringify(blogContentData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { blog } = JSON.parse(request.data);

    blogContentData = blogContentData.map((item) =>
      item.id === blog.id ? blog : item,
    );

    return new Response(JSON.stringify(blogContentData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
