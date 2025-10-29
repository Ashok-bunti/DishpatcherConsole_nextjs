import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';

const NewsItem = ({ item }) => {
  return (
    <Box
      className='item-hover'
      sx={{
        display: 'flex',
        px: 5,
        py: 2,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
        }}
        src={item.user.profilePic}
      />
      <Box
        sx={{
          ml: 3.5,
        }}
      >
        <Box
          component='h5'
          sx={{
            mb: 0.5,
          }}
        >
          {item.title}
        </Box>
        <Box
          component='p'
          sx={{
            color: 'text.secondary',
          }}
        >
          {item.desc}
          <Box
            component='span'
            className='pointer'
            sx={{
              ml: 2,
              fontSize: 13,
              color: 'primary.main',
            }}
          >
            Read More
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsItem;

NewsItem.propTypes = {
  item: PropTypes.object,
};
