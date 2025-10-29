import React from 'react';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { green, red } from '@mui/material/colors';
import { Fonts } from '@crema/constants/AppEnums';
import AppCard from '@crema/components/AppCard';
import Image from 'next/image';

const CoinStats = (props) => {
  const {
    icon,
    heading,
    bgColor = '',
    data = {
      price: '',
      increment: null,
    },
  } = props;

  return (
    <AppCard
      sxStyle={{
        borderRadius: (theme) =>
          theme.components.MuiCard.styleOverrides.root.borderRadius / 4,
      }}
      className='card-hover'
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            p: 3,
            fontSize: { xs: 30, md: 42 },
            height: { xs: 44, md: 48, xl: 52 },
            width: { xs: 44, md: 48, xl: 52 },
            backgroundColor: bgColor,
          }}
          src={icon}
        />

        <Box
          sx={{
            position: 'relative',
            ml: 4,
          }}
        >
          <Box
            component='p'
            sx={{
              fontSize: 14,
              color: 'text.secondary',
              // mb: 2,
            }}
          >
            {heading}
          </Box>
          <Box
            component='h3'
            sx={{
              display: 'inline-block',
              fontWeight: Fonts.MEDIUM,
              fontSize: 18,
              mr: 3,
            }}
          >
            ${data.price}
          </Box>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Box
            component='p'
            sx={[
              {
                fontSize: 16,
                fontWeight: Fonts.MEDIUM,
                textAlign: 'right',
              },
              data.increment > 0.0
                ? {
                    color: green[500],
                  }
                : {
                    color: red[500],
                  },
            ]}
          >
            {data.increment}%
          </Box>
          <Box
            sx={{
              fontSize: 14,
              color: 'text.secondary',
            }}
          >
            vs last 30 days
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default CoinStats;

CoinStats.propTypes = {
  icon: PropTypes.string,
  bgColor: PropTypes.string,
  data: PropTypes.object,
  heading: PropTypes.any.isRequired,
};
