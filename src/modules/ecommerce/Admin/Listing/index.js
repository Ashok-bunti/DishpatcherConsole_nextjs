'use client';
import React, { useEffect, useState } from 'react';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { Box, Grid } from '@mui/material';
import { useIntl } from 'react-intl';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsPagination from '@crema/components/AppsPagination';
import AppSearchBar from '@crema/components/AppSearchBar';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Fonts } from '@crema/constants/AppEnums';
import AppCard from '@crema/components/AppCard';
import Slide from '@mui/material/Slide';
import ListingTable from '../ListingTable';
import FilterItem from '../FilterItem';

const ProductListing = () => {
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: '',
    inStock: [],
    mrp: { start: 0, end: 30000 },
  });

  const [page, setPage] = useState(0);
  const [{ apiData, loading }, { setQueryParams }] = useGetDataApi(
    'ecommerce/admin',
    { data: [] },
    {},
    false,
  );

  const { data, count } = apiData;

  const onPageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setQueryParams({
      ...filterData,
      page,
      brand: filterData?.brand?.toString() || '',
      ideaFor: filterData?.ideaFor?.toString() || '',
      rating: filterData?.rating?.toString() || '',
      color: filterData?.color?.toString() || '',
    });
  }, [filterData, page]);

  const searchProduct = (title) => {
    setFilterData({ ...filterData, title });
  };

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        {messages['sidebar.ecommerceAdmin.productListing']}
      </Box>
      <AppGridContainer spacing={7}>
        <Slide direction='right' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={9}>
            <AppCard
              title={
                <AppsHeader>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <AppSearchBar
                      iconPosition='right'
                      overlap={false}
                      onChange={(event) => searchProduct(event.target.value)}
                      placeholder={messages['common.searchHere']}
                    />
                    <Box
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        display: { sm: 'block', xs: 'none' },
                      }}
                    >
                      <AppsPagination
                        rowsPerPage={10}
                        count={count}
                        page={page}
                        onPageChange={onPageChange}
                      />
                    </Box>
                  </Box>
                </AppsHeader>
              }
              headerStyle={{ p: 0 }}
              contentStyle={{ p: 0 }}
            >
              <AppsContent
                sx={{
                  paddingTop: 2.5,
                  paddingBottom: 2.5,
                }}
              >
                <ListingTable productData={data || []} loading={loading} />
              </AppsContent>
              <Box
                component='span'
                sx={{
                  display: { sm: 'none', xs: 'block' },
                }}
              >
                <AppsPagination
                  rowsPerPage={10}
                  count={count}
                  page={page}
                  onPageChange={onPageChange}
                />
              </Box>
            </AppCard>
          </Grid>
        </Slide>
        <Slide direction='left' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={3}>
            <FilterItem filterData={filterData} setFilterData={setFilterData} />
          </Grid>
        </Slide>
      </AppGridContainer>
    </>
  );
};

export default ProductListing;
