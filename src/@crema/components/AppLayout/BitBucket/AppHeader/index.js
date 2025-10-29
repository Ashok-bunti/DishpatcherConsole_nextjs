import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../../AppSearchBar';
import AppLogo from '../../components/AppLogo';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BitBucketHeaderWrapper from './BitBucketHeaderWrapper';

const AppHeader = ({ toggleNavCollapsed }) => {
  return (
    <Box sx={{ display: { lg: 'none', xs: 'block' } }}>
      <BitBucketHeaderWrapper className='bit-bucket-header'>
        <IconButton
          edge='start'
          className='menu-btn'
          color='inherit'
          aria-label='open drawer'
          onClick={toggleNavCollapsed}
        >
          <MenuIcon className='menu-icon' />
        </IconButton>
        <AppLogo />
        <Box
          sx={{
            ml: 'auto',
          }}
        >
          <SearchBar placeholder='Search…' />
        </Box>
      </BitBucketHeaderWrapper>
    </Box>
  );
};
export default AppHeader;

AppHeader.propTypes = {
  toggleNavCollapsed: PropTypes.func,
};
