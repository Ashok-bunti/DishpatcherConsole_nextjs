'use client';
import React from 'react';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { isEmptyObject } from '@crema/helpers/ApiHelper';
import { useParams, useRouter } from 'next/navigation';
import AddClient from './AddClient';

const EditClients = () => {
  const router = useRouter();
  const params = useParams();
  const { all } = params;
  const infoViewActionsContext = useInfoViewActionsContext();

  const [{ apiData: selectedClient }] = useGetDataApi(
    'invoice/clients/detail',
    {},
    { id: all[0] },
    true,
  );
  const onSave = (client) => {
    putDataApi('/invoice/clients', infoViewActionsContext, {
      client,
    })
      .then(() => {
        infoViewActionsContext.showMessage(
          'Client has been updated successfully!',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });

    router.push('/invoice/clients');
  };

  return (
    !isEmptyObject(selectedClient) && (
      <AddClient selectedClient={selectedClient} onSave={onSave} />
    )
  );
};

export default EditClients;
