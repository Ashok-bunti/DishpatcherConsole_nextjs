'use client';
import React from 'react';
import InvoicePdf from './index';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { isEmptyObject } from '@crema/helpers/ApiHelper';
import { useParams } from 'next/navigation';

const InvoicePdfPage = () => {
  const params = useParams();
  const { all } = params;
  const [{ apiData: invoiceSettings }] = useGetDataApi(
    '/invoice/settings',
    {},
    {},
    true,
  );
  const [{ apiData: clientsList }] = useGetDataApi(
    '/invoice/clients',
    {},
    {},
    true,
  );
  const [{ apiData: selectedInv }] = useGetDataApi(
    '/invoice/detail',
    {},
    { id: all[0] || 1 },
    true,
  );
  return (
    clientsList?.clientsData?.length > 0 &&
    !isEmptyObject(invoiceSettings.invoiceSettingsData) &&
    !isEmptyObject(selectedInv) && (
      <InvoicePdf
        selectedInv={selectedInv}
        clientsList={clientsList.clientsData}
        invoiceSettings={invoiceSettings.invoiceSettingsData}
      />
    )
  );
};

export default InvoicePdfPage;
