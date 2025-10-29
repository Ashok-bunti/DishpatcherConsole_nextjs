import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Fonts } from '@crema/constants/AppEnums';
import Image from 'next/image';

const StoriesItem = ({ stories }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          mr: 4,
          width: 60,
          height: 60,
          '& img': {
            borderRadius: 2,
            display: 'block',
            objectFit: 'cover',
          },
        }}
      >
        <Image src={stories.srcImg} alt='stories' width={60} height={60} />
      </Box>
      <Box>
        <Typography
          component='h5'
          sx={{
            fontWeight: Fonts.MEDIUM,
            mb: 0.5,
            fontSize: 14,
          }}
        >
          {stories.title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            color: 'text.secondary',
            fontSize: 12,
            fontWeight: Fonts.MEDIUM,
          }}
        >
          <Box component='span' sx={{ mr: 1 }}>
            {stories.tag}
          </Box>
          <Box component='span' sx={{ mr: 1 }}>
            .
          </Box>
          <Box component='span'>{stories.time}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StoriesItem;

StoriesItem.propTypes = {
  stories: PropTypes.object,
};
