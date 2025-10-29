import { invoiceList } from '@crema/fakedb/invoice';

let invoiceData = invoiceList;
export const GET = async (config) => {
  try {
    const params = Object.fromEntries(config.nextUrl.searchParams);
    const response = invoiceData.find(
      (invoice) => invoice.id === parseInt(params.id),
    );
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
