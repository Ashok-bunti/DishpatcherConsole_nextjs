'use client';
import React from 'react';
import Grid from '@mui/material/Grid';
import AppComponentCard from '@crema/components/AppComponentCard';
import AppComponentHeader from '@crema/components/AppComponentHeader';
import AppGridContainer from '@crema/components/AppGridContainer';
import Basic from './Basic';
import Dnd from './Dnd';
import Timeslots from './Timeslots';
import Popup from './Popup';
import Selectable from './Selectable';

const Calendar = () => {
  return (
    <>
      <AppComponentHeader
        title='React Big Calendar'
        refUrl='http://intljusticemission.github.io/react-big-calendar/examples/index.html#basic'
      />

      <AppGridContainer>
        <Grid item xs={12}>
          <AppComponentCard title='Basic Calendar' component={Basic} />
        </Grid>
        <Grid item xs={12}>
          <AppComponentCard title='Dnd Calendar' component={Dnd} />
        </Grid>

        <Grid item xs={12}>
          <AppComponentCard title='Timeslots Calendar' component={Timeslots} />
        </Grid>
        <Grid item xs={12}>
          <AppComponentCard title='Popup Calendar' component={Popup} />
        </Grid>
        <Grid item xs={12}>
          <AppComponentCard
            title='Selectable Calendar'
            component={Selectable}
          />
        </Grid>
      </AppGridContainer>
    </>
  );
};

export default Calendar;
