import contactData from '@crema/fakedb/apps/contact/contactList';
import labelList from '@crema/fakedb/apps/contact/labelList';

let contactList = contactData;

export const GET = async (request) => {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    let folderContactList = [];
    if (params.type === 'folder') {
      if (params.name === 'starred') {
        folderContactList = contactList.filter((contact) => contact.isStarred);
      } else if (params.name === 'frequent') {
        folderContactList = contactList.filter((contact) => contact.isFrequent);
      } else {
        folderContactList = contactList;
      }
    } else {
      const labelType = labelList.find(
        (label) => label.alias === params.name,
      ).id;
      folderContactList = contactList.filter(
        (contact) => contact.label === labelType,
      );
    }
    const index = params.page * 15;
    const count = folderContactList.length;
    const data =
      folderContactList.length > 15
        ? folderContactList.slice(index, index + 15)
        : folderContactList;

    return new Response(JSON.stringify({ data, count }), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { contact } = reqBody;
    contactList = [contact, ...contactList];
    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { contact } = reqBody;
    contactList = contactList.map((item) =>
      item.id === contact.id ? contact : item,
    );
    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
