'use client';
import React from 'react';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import InvoiceSettings from './index';

const InvoiceSettingsPage = () => {
  const [{ apiData: invoiceSettingsData }, { reCallAPI }] = useGetDataApi(
    'invoice/settings',
    {},
    {},
    true,
  );
  const infoViewActionsContext = useInfoViewActionsContext();
  const onUpdateSettings = (key, newSettings) => {
    const settings = {
      ...invoiceSettingsData.invoiceSettingsData,
      [key]: newSettings,
    };

    putDataApi('invoice/settings', infoViewActionsContext, { settings })
      .then((invoiceSettingsData) => {
        reCallAPI({ invoiceSettingsData });
        infoViewActionsContext.showMessage('Settings Updated Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };
  return (
    <InvoiceSettings
      defaultSettings={invoiceSettingsData.invoiceSettingsData}
      onUpdateSettings={onUpdateSettings}
    />
  );
};

export default InvoiceSettingsPage;
