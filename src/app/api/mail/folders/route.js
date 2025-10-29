import folderList from '@crema/fakedb/apps/mail/folderList';
import mailData from '@crema/fakedb/apps/mail/mailList';
let mailList = mailData;
export const GET = async (request, { params }) => {
  try {
    return new Response(JSON.stringify(folderList), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { mailIds, type } = reqBody;
    mailList = mailList.map((mail) => {
      if (mailIds.includes(mail.id)) {
        mail.folderValue = type;
        return mail;
      } else {
        return mail;
      }
    });
    return new Response(JSON.stringify({ data: mailList }), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
