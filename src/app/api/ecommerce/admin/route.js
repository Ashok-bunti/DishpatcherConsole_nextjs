import ecommerceData from '@crema/fakedb/ecommerce/ecommerceData';
let ecommerceListingData = ecommerceData;
export const GET = async (request) => {
  const { page } = Object.fromEntries(request.nextUrl.searchParams);
  try {
    const total = ecommerceData.length;
    return new Response(JSON.stringify({ data: ecommerceData, count: total }), {
      status: 200,
    }); //TODO: change to list
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
export const POST = async (request) => {
  try {
    const reqBody = await request.json();

    const { product } = reqBody;
    ecommerceListingData = ecommerceListingData.concat({
      id: ecommerceListingData.length + 1,
      ...product,
    });
    return new Response(JSON.stringify({ data: ecommerceListingData }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
export const PUT = async (request) => {
  try {
    const reqBody = await request.json();

    const { product } = reqBody;
    ecommerceListingData = ecommerceListingData.map((item) => {
      if (item.id === product.id) {
        return product;
      }
      return item;
    });
    return new Response(JSON.stringify({ data: ecommerceListingData }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
