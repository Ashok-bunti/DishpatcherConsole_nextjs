'use client';
import React from 'react';
import AddInvoice from './index';
import { postDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { useRouter } from 'next/navigation';

const AddInvoicePage = () => {
  const router = useRouter();
  const infoViewActionsContext = useInfoViewActionsContext();

  const [{ apiData: clientsList }] = useGetDataApi(
    '/invoice/clients',
    {},
    {},
    true,
  );
  const [{ apiData: invoiceSettings }] = useGetDataApi(
    '/invoice/settings',
    {},
    {},
    true,
  );
  const [{ apiData: invoiceList }] = useGetDataApi('/invoice', {}, {}, true);

  const onSave = (invoice) => {
    postDataApi('/invoice', infoViewActionsContext, { invoice })
      .then(() => {
        infoViewActionsContext.showMessage(
          'New Invoice has been created successfully!',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });

    router.push('/invoice');
  };

  return (
    clientsList &&
    invoiceList?.data?.length && (
      <AddInvoice
        clientsList={clientsList.clientsData}
        totalCount={invoiceList?.data?.length || 0}
        invoiceSettings={invoiceSettings?.invoiceSettingsData}
        onSave={onSave}
      />
    )
  );
};

export default AddInvoicePage;
