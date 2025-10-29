import React from 'react';

import { redirect } from 'next/navigation';
import AppLoader from '@crema/components/AppLoader';

const Page = () => {
  redirect('/apps/mail/inbox');
  return <AppLoader />;
};

export default Page;
