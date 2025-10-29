import ecommerceData from '@crema/fakedb/ecommerce/ecommerceData';

export const GET = async (request) => {
  const { id } = Object.fromEntries(request.nextUrl.searchParams);
  try {
    if (id >= 1) {
      const data = ecommerceData.filter((item) => +item.id === +id);
      if (data.length > 0)
        return new Response(JSON.stringify(data[0]), { status: 200 });
    }
    return new Response(JSON.stringify(ecommerceData[0]), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
