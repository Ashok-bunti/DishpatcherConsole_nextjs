import React, { useState } from 'react';
import UserInfo from './UserInfo';
import PropTypes from 'prop-types';
import ChatTabs from './ChatTabs';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { Zoom } from '@mui/material';
import { useIntl } from 'react-intl';
import AppSearchBar from '@crema/components/AppSearchBar';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { useChatContext } from '../../context/ChatContextProvider';

const ChatSideBar = ({ selectedUser, setSelectedUser }) => {
  const [keywords, setKeywords] = useState('');
  const { connectionList, loading } = useChatContext();
  const { user } = useAuthUser();

  const getConnectionList = () => {
    if (keywords !== '') {
      return connectionList.filter((item) =>
        item.name.toUpperCase().includes(keywords.toUpperCase()),
      );
    }
    return connectionList;
  };

  const getChatList = () => {
    let chatsList = connectionList.filter((item) => item.lastMessage);
    if (keywords !== '') {
      chatsList = chatsList.filter((item) =>
        item.name.toUpperCase().includes(keywords.toUpperCase()),
      );
    }
    chatsList.sort((a, b) => {
      let momentA = dayjs(a.lastMessage.time).format('X');
      let momentB = dayjs(b.lastMessage.time).format('X');
      return momentB - momentA;
    });
    return chatsList;
  };

  const connectionListData = getConnectionList();

  const chatListData = getChatList();

  const { messages } = useIntl();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Zoom in style={{ transitionDelay: '300ms' }}>
        <Box
          sx={{
            px: 5,
            pt: 4,
            pb: 2,
          }}
        >
          <UserInfo user={user} />
        </Box>
      </Zoom>
      <Box
        sx={{
          px: 5,
          pt: 2,
          width: 1,
        }}
      >
        <AppSearchBar
          sx={{
            marginRight: 0,
            width: '100%',
            '& .searchRoot': {
              width: '100%',
            },
            '& .MuiInputBase-input': {
              width: '100%',
              '&:focus': {
                width: '100%',
              },
            },
          }}
          iconPosition='right'
          overlap={false}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={messages['common.searchHere']}
        />
      </Box>

      <ChatTabs
        connectionListData={connectionListData}
        chatListData={chatListData}
        loading={loading}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </Box>
  );
};

export default ChatSideBar;

ChatSideBar.propTypes = {
  loading: PropTypes.any,
  connectionList: PropTypes.array,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
};
