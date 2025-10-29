'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import AppLoader from '../AppLoader';

const AppAsyncComponent = (importComponent, other) => {
  return dynamic(importComponent, {
    loading: () => <AppLoader />,
    ...other,
  });
};
export default AppAsyncComponent;
