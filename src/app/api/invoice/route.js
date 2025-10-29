import { invoiceList } from '@crema/fakedb/invoice';

let invoiceData = invoiceList;

const onGetInvList = (name, data) => {
  switch (name) {
    case 'sent': {
      return data.filter((inv) => inv.folderValue === 120);
    }

    case 'paid': {
      return data.filter((inv) => inv.folderValue === 121);
    }

    case 'declined': {
      return data.filter((inv) => inv.folderValue === 122);
    }

    case 'cancelled': {
      return data.filter((inv) => inv.folderValue === 123);
    }

    default: {
      return data;
    }
  }
};

export const GET = async (request) => {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    let folderinvList = [];
    if (params?.folder) {
      folderinvList = onGetInvList(params.folder, invoiceData);
    } else {
      folderinvList = invoiceData;
    }
    const index = params?.page || 0 * 15;
    const data =
      folderinvList.length > 15
        ? folderinvList.slice(index, index + 15)
        : folderinvList;
    return new Response(JSON.stringify({ data: data }), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { invoice } = reqBody;
    invoiceData = [invoice, ...invoiceData];
    return new Response(JSON.stringify(invoice), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { invoice } = reqBody;

    invoiceData = invoiceData.map((item) => {
      if (item.id === invoice.id) {
        return invoice;
      }
      return item;
    });
    return new Response(JSON.stringify(invoiceData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
