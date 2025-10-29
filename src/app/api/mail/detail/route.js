import mailData from '@crema/fakedb/apps/mail/mailList';
let mailList = mailData;
export const GET = async (request, { params }) => {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);

    mailList = mailList.map((mail) => {
      if (params.id === mail.id) {
        mail.isRead = false;
        return mail;
      } else {
        return mail;
      }
    });
    const response = mailList.find((mail) => mail.id === parseInt(params.id));
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
export const PUT = async (request) => {
  try {
    const reqBody = await request.json();

    const { mail } = reqBody;
    mailList = mailList.map((item) => (item.id === mail.id ? mail : item));
    return new Response(JSON.stringify({ data: mail }), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
