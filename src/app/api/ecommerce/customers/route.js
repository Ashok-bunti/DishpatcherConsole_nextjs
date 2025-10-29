import { customersData } from '@crema/fakedb/ecommerce/ecommerceData';

export const GET = async (request) => {
  const { search, page } = Object.fromEntries(request.nextUrl.searchParams);
  try {
    let customers = [...customersData];

    if (search) {
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return new Response(
      JSON.stringify({
        customerCount: customers.length,
        customers: customers.splice(page * 10, (page + 1) * 10),
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
