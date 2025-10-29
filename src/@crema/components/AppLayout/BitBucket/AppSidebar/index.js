import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppScrollbar from '../../../AppScrollbar';
import MainSidebar from '../../components/MainSidebar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import VerticalNav from '../../components/VerticalNav';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BitBucketSidebarWrapper from './BitBucketSidebarWrapper';
import AppSidebarContainer from './AppSidebarContainer';
import BucketMinibar from './BucketMinibar';
import { Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';

const AppSidebar = (props) => {
  const {
    isCollapsed,
    setCollapsed,
    routesConfig,
    isNavCollapsed,
    toggleNavCollapsed,
    variant = '',
    position = 'left',
  } = props;

  const sideBarComponent = () => {
    return (
      <BitBucketSidebarWrapper className='bit-bucket-sidebar'>
        <Box className='bit-bucket-sidebar-fixed'>
          <Box
            className='bit-bucket-btn'
            onClick={() => setCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
          </Box>
          <BucketMinibar />
          <AppSidebarContainer className='app-sidebar-container'>
            <MainSidebar>
              <Box
                sx={{
                  py: 4.5,
                  px: 7.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: Fonts.MEDIUM,
                  }}
                  component='h2'
                >
                  Crema
                </Typography>
              </Box>
              <AppScrollbar
                sx={{
                  py: 2,
                  height: 'calc(100vh - 70px) !important',
                }}

              >
                <VerticalNav routesConfig={routesConfig} />
              </AppScrollbar>
            </MainSidebar>
          </AppSidebarContainer>
        </Box>
      </BitBucketSidebarWrapper>
    );
  };
  return (
    <>
      <Drawer
        anchor={position}
        open={isNavCollapsed}
        onClose={toggleNavCollapsed}
        classes={{
          root: clsx(variant),
          paper: clsx(variant),
        }}
        sx={{ position: 'absolute', display: { lg: 'none', xs: 'block' } }}
      >
        {sideBarComponent()}
      </Drawer>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        {sideBarComponent()}
      </Box>
    </>
  );
};
export default AppSidebar;
AppSidebar.propTypes = {
  position: PropTypes.string,
  variant: PropTypes.string,
  isCollapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  toggleNavCollapsed: PropTypes.func,
  isNavCollapsed: PropTypes.bool,
  routesConfig: PropTypes.array,
};
