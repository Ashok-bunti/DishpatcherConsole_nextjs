import connectionList from '@crema/fakedb/apps/chat/connectionList';
import chatList from '@crema/fakedb/apps/chat/chatList';

let connectionData = connectionList;
let chatData = chatList;

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { channelId, messageId } = reqBody;
    let userMessages = chatData.find((chat) => chat.channelId === channelId);
    userMessages.messageData = userMessages.messageData.filter(
      (item) => item.id !== messageId,
    );
    let user = connectionData.find(
      (connection) => connection.channelId === channelId,
    );
    if (user.lastMessage.id === messageId) {
      user = {
        ...user,
        lastMessage:
          userMessages.messageData[userMessages.messageData.length - 1],
      };
      connectionData = connectionData.map((item) =>
        item.id === user.id ? user : item,
      );
    }
    return new Response(JSON.stringify({ connectionData, userMessages }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
