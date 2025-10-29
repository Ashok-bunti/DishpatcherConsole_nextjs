import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppScrollbar from '../../../AppScrollbar';
import MainSidebar from '../../components/MainSidebar';
import Drawer from '@mui/material/Drawer';
import VerticalNav from '../../components/VerticalNav';
import UserMiniHeaderSidebarWrapper from './UserMiniHeaderSidebarWrapper';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import { Box } from '@mui/material';

const AppSidebar = (props) => {
  const { variant = '', position = 'left' } = props;
  const { footer, footerType } = useLayoutContext();

  return (
    <>
      <Drawer
        anchor={position}
        open={props.isNavCollapsed}
        onClose={props.toggleNavCollapsed}
        classes={{
          root: clsx(variant),
          paper: clsx(variant),
        }}
        sx={{ position: 'absolute', display: { lg: 'none', xs: 'block' } }}
      >
        <UserMiniHeaderSidebarWrapper className='user-mini-header-sidebar'>
          <MainSidebar>
            <AppScrollbar
              sx={{
                py: 2,
              }}
              
            >
              <VerticalNav routesConfig={props.routesConfig} />
            </AppScrollbar>
          </MainSidebar>
        </UserMiniHeaderSidebarWrapper>
      </Drawer>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <UserMiniHeaderSidebarWrapper className='user-mini-header-sidebar'>
          <MainSidebar>
            <AppScrollbar
              className={clsx({
                'has-footer-fixed': footer && footerType === 'fixed',
              })}
              sx={{
                py: 2,
                height: 'calc(100vh - 71px) !important',
                '&.has-footer-fixed': {
                  height: {
                    xs: 'calc(100vh - 119px) !important',
                    xl: 'calc(100vh - 131px) !important',
                  },
                },
              }}
              
            >
              <VerticalNav routesConfig={props.routesConfig} />
            </AppScrollbar>
          </MainSidebar>
        </UserMiniHeaderSidebarWrapper>
      </Box>
    </>
  );
};
export default AppSidebar;

AppSidebar.propTypes = {
  position: PropTypes.string,
  routesConfig: PropTypes.array,
  variant: PropTypes.string,
  toggleNavCollapsed: PropTypes.func,
  isNavCollapsed: PropTypes.bool,
};
