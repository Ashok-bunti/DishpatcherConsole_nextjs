import React from 'react';
import Box from '@mui/material/Box';
import './index.css';
import Image from 'next/image';
const bannerItems = [
  {
    name: 'Figma',
    img: '/assets/images/banner/figma-main-icon.svg',
    link: '/',
  },
  {
    name: 'Material UI',
    img: '/assets/images/banner/mui.png',
    link: '/',
  },
  {
    name: 'Ant Design + Styled Components',
    img: '/assets/images/banner/antd.svg',
    link: '/',
  },
];
const Banner = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        color: '#fff',
        padding: '100px 0 ',
        maxWidth: '1370px',
        margin: 'auto',
      }}
    >
      <Box className='banner-content'>
        <h1 className='banner_heading'>Crema Theme</h1>
        <h2 style={{ fontSize: '30px' }}>
          Available with <span style={{ color: '#fff000' }}>MUI</span> and{' '}
          <span>Ant Design + 💅</span>
        </h2>
        <p style={{ fontSize: '24px', margin: '24px auto' }}>
          Crema is the perfect UI Kit to start your next project. It provides a
          clean and clear codebase.
        </p>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          fontSize: '16px',
          padding: '30px 0',
          flexWrap: 'wrap',
        }}
      >
        {bannerItems.map((items) => (
          <Box key={items.name} className='banner-items'>
            <Box
              sx={{
                backgroundColor: '#fff',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
              }}
            >
              <Image src={items.img} alt={items.name} width={40} height={40} />
            </Box>

            <span>{items.name}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Banner;
