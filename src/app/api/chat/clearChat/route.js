import connectionList from '@crema/fakedb/apps/chat/connectionList';
import chatList from '@crema/fakedb/apps/chat/chatList';

let connectionData = connectionList;
let chatData = chatList;

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const { channelId } = reqBody;
    let user = connectionData.find(
      (connection) => connection.channelId === channelId,
    );
    user = { ...user, lastMessage: null };

    connectionData = connectionData.map((item) =>
      item.channelId === user.channelId ? user : item,
    );
    return new Response(JSON.stringify({ connectionData, userMessages: [] }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
