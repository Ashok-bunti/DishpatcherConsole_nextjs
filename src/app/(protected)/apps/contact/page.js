import React from 'react';
import { redirect } from 'next/navigation';
import AppLoader from '@crema/components/AppLoader';

const Page = () => {
  redirect('/apps/contact/folder/all');
  return <AppLoader />;
};

export default Page;
