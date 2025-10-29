import React from 'react';
import { orange } from '@mui/material/colors';
import { Box, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuthMethod, useAuthUser } from '../../../../hooks/AuthHooks';
import AppLoader from '../../../AppLoader';

const UserInfo = ({ color = 'text.secondary' }) => {
  const { logout } = useAuthMethod();
  const { user, isAuthenticated } = useAuthUser();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserAvatar = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  if (!isAuthenticated) {
    return <AppLoader />;
  }

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          py: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        className='user-info-view'
      >

        <Box
          sx={{
            width: { xs: 'calc(100% - 62px)', xl: 'calc(100% - 72px)' },
            color: 'white',
          }}
          className='user-info'
        >


          <Box
            sx={{
              fontFamily: [
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                'Ubuntu',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
              ].join(', '),
              fontStyle: 'normal',
              fontWeight: 600,
              color: 'black',
              fontSize: '18px',
              lineHeight: 'normal',
              mt: -0.5,
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textOverflow: 'clip',
              alignItems: 'center',
              textAlign: 'center',

            }}
          >
            {user.displayName ? user.displayName : 'User'}
          </Box>

          <Box
            sx={{
              fontSize: '13px',
              fontWeight: 400,
              color: '#7a869a',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textOverflow: 'clip',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {user?.userProfileId?.Company_Details?.designation
              ? user.userProfileId.Company_Details.designation.toUpperCase()
              : 'NO DESIGNATION'}

          </Box>
        </Box>
        <>
          <Divider
            orientation='vertical'
            flexItem
            sx={{
              backgroundColor: '#e0e0e0',
              height: 40,
              mx: 2,
            }}
          />
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              cursor: 'pointer',
              marginTop: '-5px',
            }}
          >
            <ExpandMoreIcon />
          </Box>
        </>
      </Box>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            router.push('/account/my-profile');
          }}
        >
          My account
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserInfo;

UserInfo.propTypes = {
  color: PropTypes.string,
};