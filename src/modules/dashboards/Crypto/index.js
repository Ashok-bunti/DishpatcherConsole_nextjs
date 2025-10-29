'use client';
import TotalBalance from './TotalBalance';
import Coins from './Coins';
import BuySell from './BuySell';
import TradingChart from './TradingChart';
import OrdersActivities from './OrdersActivities';
import TopStories from './TopStories';
import GainerLooser from './GainerLooser';
import ATCStatics from './ATCStatics';
import CardDetails from './CardDetails';
import QuickTransfer from './QuickTransfer';
import React from 'react';
import Grid from '@mui/material/Grid';
import AppGridContainer from '@crema/components/AppGridContainer';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';

const Crypto = () => {
  const [{ apiData, loading }] = useGetDataApi('dashboard/crypto');
  console.log('apiData', apiData);

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppGridContainer>
            <Grid item xs={12} md={5}>
              <TotalBalance totalBalanceData={apiData.totalBalanceData} />
            </Grid>

            <Grid item xs={12} md={7}>
              <Coins coinsData={apiData.coinsData} />
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <TradingChart />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <BuySell buySell={apiData.buySell} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <OrdersActivities ordersActivities={apiData.ordersActivities} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TopStories stories={apiData.stories} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GainerLooser data={apiData.gainerLooser} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ATCStatics data={apiData.atcStatics} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardDetails cardDetails={apiData.cardDetails} />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickTransfer quickTransfer={apiData.quickTransfer} />
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default Crypto;
