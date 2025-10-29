import connectionList from '@crema/fakedb/apps/chat/connectionList';
import chatList from '@crema/fakedb/apps/chat/chatList';

let connectionData = connectionList;
let chatData = chatList;

export const GET = async (config) => {
  try {
    const params = Object.fromEntries(config.nextUrl.searchParams);
    const { id } = params;
    const response = chatData.find((chat) => chat.channelId === parseInt(id));
    if (response) {
      return new Response(JSON.stringify(response), { status: 200 });
    }
    return new Response(JSON.stringify(null), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { channelId, message } = reqBody;
    const id = (Math.random() * 10000).toFixed();
    const data = { ...message, id };
    let user = connectionData.find(
      (connection) => connection.channelId === channelId,
    );
    user = { ...user, lastMessage: data };
    connectionData = connectionData.map((item) =>
      item.channelId === user.channelId ? user : item,
    );
    let userMessages = chatData.find((chat) => chat.channelId === channelId);
    if (userMessages) {
      userMessages.messageData = userMessages.messageData.concat(data);
    } else {
      userMessages = {
        id: channelId,
        messageData: [data],
      };
      chatData = chatData.concat(userMessages);
    }
    return new Response(JSON.stringify({ connectionData, userMessages }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { channelId, message } = reqBody;
    let user = connectionData.find(
      (connection) => connection.channelId === channelId,
    );
    if (user.lastMessage.id === message.id) {
      user = { ...user, lastMessage: message };
      connectionData = connectionData.map((item) =>
        item.channelId === user.channelId ? user : item,
      );
    }
    let userMessages = chatData.find((chat) => chat.channelId === channelId);

    userMessages.messageData = userMessages.messageData.map((item) =>
      item.id === message.id ? message : item,
    );
    return new Response(JSON.stringify({ connectionData, userMessages }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
