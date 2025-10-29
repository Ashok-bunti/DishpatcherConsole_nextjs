'use client';
import React from 'react';
import AppCard from '@crema/components/AppCard';
import AppGridContainer from '@crema/components/AppGridContainer';

import AppAnimate from '@crema/components/AppAnimate';
import PropTypes from 'prop-types';
import AppInfoView from '@crema/components/AppInfoView';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';
import ProductImageSlide from './ProductImageSlide';
import Header from './Header';
import ProductView from './ProductView';
import SimilarProduct from './SimilarProduct';
import { useParams } from 'next/navigation';

const ProductDetail = () => {
  const params = useParams();
  const [{ apiData: currentProduct, loading }] = useGetDataApi(
    'ecommerce',
    {},
    { id: params?.all?.[0] ? params?.all?.[0] : 0 },
  );

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppCard>
            <Header product={currentProduct} />
            <AppGridContainer>
              <ProductImageSlide product={currentProduct} />
              <ProductView product={currentProduct} />
            </AppGridContainer>
            <SimilarProduct />
          </AppCard>
        </AppAnimate>
      )}
      <AppInfoView />
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  match: PropTypes.object,
};
