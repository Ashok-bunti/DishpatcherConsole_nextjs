import React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import IntlMessages from '@crema/helpers/IntlMessages';
import Activity from './Activity';
import Application from './Application';
import { accountData } from '@crema/fakedb';

const Notification = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        // width: '100%',
      }}
    >
      <Activity activity={accountData.notification.activity} />
      <Box
        sx={(theme) => ({
          mx: -5,
          px: 5,
          pt: 5,
          borderTop: `solid 1px ${theme.palette.divider}`,
        })}
      >
        <Application application={accountData.notification.application} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          sx={{
            position: 'relative',
            minWidth: 100,
          }}
          color='primary'
          variant='contained'
          type='submit'
        >
          <IntlMessages id='common.saveChanges' />
        </Button>
        <Button
          sx={{
            position: 'relative',
            minWidth: 100,
            ml: 2.5,
          }}
          color='primary'
          variant='outlined'
          type='cancel'
        >
          <IntlMessages id='common.cancel' />
        </Button>
      </Box>
    </Box>
  );
};

export default Notification;
