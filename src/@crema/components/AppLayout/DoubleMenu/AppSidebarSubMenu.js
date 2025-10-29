import React from 'react';
import Drawer from '@mui/material/Drawer';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import useStyles from './AppSidebarSubMenu.style';
import AppScrollbar from '../../AppScrollbar';
import MainMenu from './SidebarMenu/MainMenu';
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';

const AppSidebarSubMenu = (props) => {
  const { variant = '', position = 'left' } = props;
  const { themeMode } = useThemeContext();

  const classes = useStyles({ themeMode });
  let sidebarClasses = classes.sidebarStandard;
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
        <Box
          className={clsx(
            classes.appSidebarSubMenuRoot,
            'app-sidebar-sub-menu',
          )}
        >
          <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
            <AppScrollbar className={classes.drawerScrollAppSidebar}>
              <MainMenu item={props.item} />
            </AppScrollbar>
          </Box>
        </Box>
      </Drawer>
      <Box
        className={clsx(classes.appSidebarSubMenuRoot, 'app-sidebar-sub-menu')}
        sx={{
          height: '100%',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
          <AppScrollbar className={classes.scrollAppSidebar}>
            <MainMenu item={props.item} />
          </AppScrollbar>
        </Box>
      </Box>
    </>
  );
};

export default AppSidebarSubMenu;

AppSidebarSubMenu.propTypes = {
  position: PropTypes.string,
  variant: PropTypes.string,
  toggleNavCollapsed: PropTypes.func,
  isNavCollapsed: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    auth: PropTypes.object,
    exact: PropTypes.bool,
    messageId: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    url: PropTypes.string,
    color: PropTypes.string,
  }),
};
