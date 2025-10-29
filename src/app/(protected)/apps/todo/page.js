import React from 'react';

import { redirect } from 'next/navigation';
import AppLoader from '@crema/components/AppLoader';

const Page = () => {
  redirect('/apps/todo/all');
  return <AppLoader />;
};

export default Page;
