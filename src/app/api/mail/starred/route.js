import mailData from '@crema/fakedb/apps/mail/mailList';
let mailList = mailData;
//
// export const PUT = async (request) => {
//   try {
//     const reqBody = await request.json();

//     const { mail } = reqBody;

//     mailList = mailList.map((item) => {
//       if (item.id === mail.id) {
//         item.messages.map((message) => {
//           message.isStarred = mail.isStarred;
//         });
//       }
//
//     });
//
//     return new Response(JSON.stringify({ data: mail }), { status: 200 });
//   } catch (error) {

//     return new Response('Internal Server Error', { status: 500 });
//   }
// };
//
export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { mail } = reqBody;
    const mailIds = mail.id;
    mailList = mailList.map((task) => {
      if (mailIds === task.id) {
        task.isStarred = !!mail.isStarred;
        return task;
      } else {
        return task;
      }
    });
    // const updatedTasks = mailList.filter((task) => mail?.id?.includes(task.id));

    return new Response(JSON.stringify({ data: mailList }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
