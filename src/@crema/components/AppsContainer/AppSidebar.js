import React from 'react';
import Drawer from '@mui/material/Drawer';
import Card from '@mui/material/Card';
import { Box, drawerClasses, Slide } from '@mui/material';
import PropTypes from 'prop-types';

const AppSidebar = (props) => {
  const { isAppDrawerOpen, sidebarContent, toggleNavCollapsed } = props;
  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Box
        sx={{
          height: '100%',
          width: {
            lg: 280,
          },
        }}
      >
        <Drawer
          open={isAppDrawerOpen}
          onClose={toggleNavCollapsed}
          sx={{
            position: 'absolute',
            display: { lg: 'none', xs: 'block' },
            [`& .${drawerClasses.paper}`]: {
              width: 280,
              '& .listItem': {
                zIndex: 1305,
              },
            },
          }}
        >
          {sidebarContent}
        </Drawer>
        <Card style={{ display: { lg: 'block', xs: 'none' }, height: '100%' }}>
          {sidebarContent}
        </Card>
      </Box>
    </Slide>
  );
};
export default AppSidebar;
AppSidebar.propTypes = {
  isAppDrawerOpen: PropTypes.bool,
  footer: PropTypes.bool,
  navStyle: PropTypes.string,
  toggleNavCollapsed: PropTypes.func,
  fullView: PropTypes.bool,
  sidebarContent: PropTypes.node,
};
