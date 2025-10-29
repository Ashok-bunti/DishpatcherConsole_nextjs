import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Fonts } from '@crema/constants/AppEnums';
import Image from 'next/image';

const IntroductionItem = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box sx={{ mr: 5 }}>
        <Image
          src={data.icon}
          alt='icon'
          width={34}
          height={37}
          style={{ minWidth: 34 }}
        />
      </Box>
      <Box>
        <Typography
          component='h4'
          variant='h4'
          sx={{ fontWeight: Fonts.SEMI_BOLD, fontSize: 16, mb: 2.5 }}
        >
          {data.title}
        </Typography>
        <Typography
          sx={(theme) => ({
            mb: {
              xs: 2,
              md: 3,
              color: theme.palette.text.secondary,
            },
          })}
        >
          {data.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default IntroductionItem;

IntroductionItem.propTypes = {
  data: PropTypes.object,
};
