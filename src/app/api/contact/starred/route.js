import contactData from '@crema/fakedb/apps/contact/contactList';

let contactList = contactData;
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
    const { contact } = reqBody;
    const contactIds = contact.id;
    contactList = contactList.map((task) => {
      if (contactIds === task.id) {
        task.isStarred = !!contact.isStarred;
        return task;
      } else {
        return task;
      }
    });
    // const updatedTasks = mailList.filter((task) => mail?.id?.includes(task.id));

    return new Response(JSON.stringify({ data: contactList }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
