'use client';
import React from 'react';
import { Box } from '@mui/material';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import OrderPlaced from './OrderPlaced';
import AddressInfo from './AddressInfo';
import ItemsList from './ItemsList';
import AppLoader from '@crema/components/AppLoader';
import { addresses } from '@crema/fakedb';

const Confirmation = () => {
  const [{ apiData, loading }] = useGetDataApi('ecommerce/cart', []);
  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <Box>
            <OrderPlaced cartItems={apiData.data} />
            <AddressInfo address={addresses[0]} />
            <ItemsList cartItems={apiData.data} />
          </Box>
        </AppAnimate>
      )}
    </>
  );
};

export default Confirmation;
