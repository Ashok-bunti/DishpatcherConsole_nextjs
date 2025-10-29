import React from 'react';
import AddInvoice from '../AddInvoice';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useParams, useRouter } from 'next/navigation';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { isEmptyObject } from '@crema/helpers/ApiHelper';

const EditInvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const { all } = params;
  const infoViewActionsContext = useInfoViewActionsContext();

  const [{ apiData: clientsList }] = useGetDataApi(
    '/invoice/clients',
    {},
    {},
    true,
  );
  const [{ apiData: invoiceSettings }] = useGetDataApi(
    '/invoice/clients',
    {},
    {},
    true,
  );

  const [{ apiData: invoiceList }] = useGetDataApi('/invoice', {}, {}, true);
  const [{ apiData: selectedInv }] = useGetDataApi(
    '/invoice/detail',
    {},
    { id: all?.[0] },
    true,
  );

  const onSave = (invoice) => {
    putDataApi('/invoice', infoViewActionsContext, { invoice })
      .then(() => {
        infoViewActionsContext.showMessage(
          'New Invoice has been udpated successfully!',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });

    router.push('/invoice');
  };

  return (
    clientsList &&
    invoiceList?.data?.length &&
    !isEmptyObject(selectedInv) && (
      <AddInvoice
        selectedInv={selectedInv}
        clientsList={clientsList.clientsData}
        totalCount={invoiceList?.data?.length || 0}
        invoiceSettings={invoiceSettings?.invoiceSettingsData}
        onSave={onSave}
      />
    )
  );
};

export default EditInvoicePage;
