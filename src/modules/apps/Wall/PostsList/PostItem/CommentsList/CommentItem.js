import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { MessageType } from '@crema/fakedb/apps/chat/connectionList';
import Image from 'next/image';

const CommentItem = ({ item }) => {
  const { author, message_type, media, comment, liked } = item;
  const [isLiked, setIsLiked] = useState(liked);

  const toggleLikeStatus = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Box
      sx={{
        '&:not(:last-of-type)': {
          marginBottom: 5,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
          }}
          src={author.profilePic}
        />
        <Box
          sx={{
            ml: 3.5,
          }}
        >
          {message_type === MessageType.TEXT ? (
            <Box
              sx={(theme) => ({
                padding: '10px 20px',
                border: `solid 1px ${theme.palette.divider}`,
                borderRadius: 10,
                borderBottomLeftRadius: 0,
              })}
            >
              <Typography>{comment}</Typography>
            </Box>
          ) : (
            <Box
              sx={(theme) => ({
                padding: '10px 20px',
                border: `solid 1px ${theme.palette.divider}`,
                borderRadius: 10,
                borderBottomLeftRadius: 0,
                '& img': {
                  maxHeight: 100,
                },
              })}
            >
              <Image
                src={media.url}
                alt='comment-img'
                width={191}
                height={100}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Box
              className='pointer'
              onClick={toggleLikeStatus}
              sx={{
                color: isLiked && 'primary.main',
              }}
            >
              Like
            </Box>
            <Box
              className='pointer'
              sx={{
                ml: 4,
              }}
            >
              Reply
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentItem;

CommentItem.propTypes = {
  item: PropTypes.object,
};
