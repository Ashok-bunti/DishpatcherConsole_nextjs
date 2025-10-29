'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { postDataApi } from '@crema/hooks/APIHooks';
import AddClient from './AddClient';

const AddClients = () => {
  const router = useRouter();
  const infoViewActionsContext = useInfoViewActionsContext();

  const onSave = (client) => {
    postDataApi('/invoice/clients', infoViewActionsContext, {
      client,
    })
      .then(() => {
        infoViewActionsContext.showMessage(
          'New Client has been created successfully!',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });

    router.push('/invoice/clients');
  };

  return <AddClient onSave={onSave} />;
};

export default AddClients;
