import React from 'react';
import Drawer from '@mui/material/Drawer';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppScrollbar from '../../AppScrollbar';
import VerticalNav from '../components/VerticalNav';
import MainSidebar from '../components/MainSidebar';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import UserInfo from '../components/UserInfo';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import { Box } from '@mui/material';

const AppSidebar = ({
  toggleNavCollapsed,
  isNavCollapsed,
  variant = '',
  position = 'left',
  routesConfig,
}) => {
  const { footer, footerType } = useLayoutContext();

  const { sidebarTextColor } = useSidebarContext();

  const handleToggleDrawer = () => {
    toggleNavCollapsed();
  };
  return (
    <>
      <Drawer
        anchor={position}
        open={isNavCollapsed}
        onClose={() => handleToggleDrawer()}
        classes={{
          root: clsx(variant),
          paper: clsx(variant),
        }}
        sx={{ position: 'absolute', display: { lg: 'none', xs: 'block' } }}
      >
        <MainSidebar>
          <UserInfo color={sidebarTextColor} />
          <AppScrollbar
            sx={(theme) => ({
              py: 2,
              height: 'calc(100vh - 70px) !important',
              borderTop: `solid 1px ${theme.palette.divider}`,
              mt: 0.5,
            })}
          >
            <VerticalNav routesConfig={routesConfig} />
          </AppScrollbar>
        </MainSidebar>
      </Drawer>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <MainSidebar>
          <UserInfo color={sidebarTextColor} />
          <AppScrollbar
            className={clsx({
              'has-footer-fixed': footer && footerType === 'fixed',
            })}
            sx={(theme) => ({
              py: 2,
              height: 'calc(100vh - 70px) !important',
              borderTop: `solid 1px ${theme.palette.divider}`,
              mt: 0.5,
              '&.has-footer-fixed': {
                height: {
                  xs: 'calc(100vh - 117px) !important',
                  xl: 'calc(100vh - 127px) !important',
                },
              },
            })}
          >
            <VerticalNav routesConfig={routesConfig} />
          </AppScrollbar>
        </MainSidebar>
      </Box>
    </>
  );
};

export default AppSidebar;

AppSidebar.propTypes = {
  position: PropTypes.string,
  variant: PropTypes.string,
  routesConfig: PropTypes.array,
  isNavCollapsed: PropTypes.bool,
  toggleNavCollapsed: PropTypes.func,
};
