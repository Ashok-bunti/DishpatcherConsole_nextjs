import React from 'react';
import asyncComponent from '../AppAsyncComponent';

const AppInfoViewContext = asyncComponent(() => import('./ContextView'));
const AppInfoViewRedux = asyncComponent(() => import('./ReduxView'));

const AppInfoView = () => {
  if (process.env.NEXT_PUBLIC_STATE_TYPE === 'context') {
    return <AppInfoViewContext />;
  }
  return <AppInfoViewRedux />;
};

export default AppInfoView;
