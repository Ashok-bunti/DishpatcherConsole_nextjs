import React from 'react';
import Box from '@mui/material/Box';
import Banner from './Banner';
import NavBar from './Navbar';
import './index.css';
const Header = () => {
  return (
    <Box
      id='header'
      sx={{
        background: `url(/assets/images/banner/header-background.png)`,
      }}
    >
      <NavBar />
      <Banner />
    </Box>
  );
};

export default Header;
