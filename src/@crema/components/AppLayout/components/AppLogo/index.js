import React from 'react';
import { Box } from '@mui/material';
import AppImage from '@crema/components/AppImage';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';

const AppLogo = ({ hasSidebarColor }) => {
  const { sidebarColorSet } = useSidebarContext();
  return (
    <Box
      sx={{
        height: { xs: 56, sm: 70 },
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
          height: { xs: 40, sm: 45 },
        },
      }}
      className='app-logo'
    >
      {hasSidebarColor && sidebarColorSet?.mode === 'dark' ? (
        <AppImage
          src='/assets/images/logo-white-with-name.png'
          alt='crema-logo'
          width={146}
          height={50}
          //werthj
        />
      ) : (
        <AppImage
          src='/assets/images/logo-with-name.svg'
          alt='crema-logo'
          width={146}
          height={50}
          //werthj
        />
      )}
      {/* 
      <Box
        sx={{
          mt: 1,
          display: { xs: "none", md: "block" },
          "& img": {
            height: { xs: 25, sm: 30 },
          },
        }}
      >
        <AppImage src="/assets/images/logo-with-name.png" alt="crema-logo" />
      </Box> */}
    </Box>
  );
};

export default AppLogo;
