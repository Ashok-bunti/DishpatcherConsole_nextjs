import connectionList from '@crema/fakedb/apps/chat/connectionList';
import chatList from '@crema/fakedb/apps/chat/chatList';

let connectionData = connectionList;
let chatData = chatList;

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { channelId } = reqBody;
    chatData = chatData.filter((chat) => chat.channelId !== channelId);
    let user = connectionData.find(
      (connection) => connection.channelId === channelId,
    );
    delete user.lastMessage;
    connectionData = connectionData.map((item) =>
      item.id === user.id ? user : item,
    );
    return new Response(JSON.stringify(connectionData), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
