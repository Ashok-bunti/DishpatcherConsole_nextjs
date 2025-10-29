'use client';
import React, { useEffect, useState } from 'react';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import PropTypes from 'prop-types';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import { alpha, Box } from '@mui/material';
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import AppsFooter from '@crema/components/AppsContainer/AppsFooter';
import AppsPagination from '@crema/components/AppsPagination';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import ProductHeader from '../ProductHeader';
import { VIEW_TYPE } from '../index';
import ProductGrid from './ProductGrid';
import ProductList from './ProductList';

const ProductListing = ({
  filterData,
  viewType,
  setViewType,
  setFilterData,
}) => {
  const { theme } = useThemeContext();
  const [page, setPage] = useState(0);
  const [{ apiData, loading }, { setQueryParams }] = useGetDataApi(
    'ecommerce/products',
    [],
    {},
    false,
  );

  const { data, count } = apiData;
  useEffect(() => {
    setQueryParams({
      page,
      ...filterData,
      brand: filterData?.brand?.toString() || '',
      ideaFor: filterData?.ideaFor?.toString() || '',
      rating: filterData?.rating?.toString() || '',
      color: filterData?.color?.toString() || '',
    });
  }, [page, filterData]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setFilterData({ ...filterData, title });
  };
  return (
    <>
      <AppsHeader>
        <ProductHeader
          list={data}
          viewType={viewType}
          page={page}
          totalProducts={count}
          onPageChange={onPageChange}
          onSearch={searchProduct}
          setViewType={setViewType}
        />
      </AppsHeader>

      <AppsContent
        style={{
          backgroundColor: alpha(theme.palette.background.default, 0.6),
        }}
      >
        <Box
          sx={{
            width: '100%',
            flex: 1,
            display: 'flex',
            py: 2,
            px: 4,
            height: 1,
            '& > div': {
              width: '100%',
            },
          }}
        >
          {viewType === VIEW_TYPE.GRID ? (
            <ProductGrid ecommerceList={data} loading={loading} />
          ) : (
            <ProductList ecommerceList={data} loading={loading} />
          )}
        </Box>
      </AppsContent>
      <Box component='span' sx={{ display: { sm: 'none', xs: 'block' } }}>
        {data?.length > 0 ? (
          <AppsFooter>
            <AppsPagination
              count={count}
              rowsPerPage={10}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        ) : null}
      </Box>
    </>
  );
};
export default ProductListing;
ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string,
  setViewType: PropTypes.func,
  setFilterData: PropTypes.func,
};
