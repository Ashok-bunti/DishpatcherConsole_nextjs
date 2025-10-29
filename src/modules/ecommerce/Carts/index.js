'use client';
import React from 'react';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import AppCard from '@crema/components/AppCard';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppGridContainer from '@crema/components/AppGridContainer';
import { postDataApi, putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import OrderSummary from '../OrderSummary';
import CartTable from './CartTable';
import AppLoader from '@crema/components/AppLoader';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { useRouter } from 'next/navigation';

const Carts = () => {
  const infoViewActionsContext = useInfoViewActionsContext();
  const router = useRouter();
  const [{ apiData, loading }, { setData }] = useGetDataApi(
    'ecommerce/cart',
    {
      data: [],
    },
    {},
  );
  const onRemoveItem = (product) => {
    postDataApi('/api/cart/remove', infoViewActionsContext, {
      product,
    })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onDecrement = (data) => {
    if (data.count > 1) {
      putDataApi('ecommerce/cart', infoViewActionsContext, {
        product: { ...data, count: data.count - 1 },
      })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          infoViewActionsContext.fetchError(error.message);
        });
    } else {
      postDataApi('/api/cart/remove', infoViewActionsContext, {
        product: data,
      })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          infoViewActionsContext.fetchError(error.message);
        });
    }
  };
  const onIncrement = (data) => {
    putDataApi('ecommerce/cart', infoViewActionsContext, {
      product: { ...data, count: data.count + 1 },
    })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <Box>
            <Box
              component='h2'
              sx={{
                color: 'text.primary',
                fontWeight: Fonts.BOLD,
                mb: 6,
                fontSize: 16,
              }}
            >
              <IntlMessages id='sidebar.ecommerce.cart' />
            </Box>
            <AppGridContainer>
              <Grid item xs={12} md={8}>
                <AppCard
                  contentStyle={{ px: 0 }}
                  footer={
                    <Box
                      sx={{
                        mt: 4,
                        width: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          router.push('/ecommerce/products');
                        }}
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          router.push('/ecommerce/checkout');
                        }}
                      >
                        Checkout
                      </Button>
                    </Box>
                  }
                >
                  <CartTable
                    cartItems={apiData?.data}
                    onRemoveItem={onRemoveItem}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                  />
                </AppCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <OrderSummary cartItems={apiData?.data} />
              </Grid>
            </AppGridContainer>
          </Box>
        </AppAnimate>
      )}
    </>
  );
};

export default Carts;
