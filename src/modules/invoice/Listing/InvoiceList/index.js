'use client';
import React, { useEffect, useState } from 'react';
import InvContentHeader from './InvContentHeader';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import InvoiceTable from '../../InvoiceTable';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { isEmptyObject } from '@crema/helpers/ApiHelper';
import AppLoader from '@crema/components/AppLoader';
import { useParams, useRouter } from 'next/navigation';

const InvoiceList = () => {
  const { asPath } = useRouter();
  const params = useParams();
  const { all } = params;
  const infoViewActionsContext = useInfoViewActionsContext();

  let folder;

  if (all && all.length === 1) {
    folder = all[0];
  }

  const [{ apiData: invoiceList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi('/invoice', {}, { folder: folder || 'all' }, true);

  const [page, setPage] = useState(0);

  const onPageChange = (event, value) => {
    setPage(value);
  };
  const [filterText, onSetFilterText] = useState('');

  const [checkedInvs, setCheckedInvs] = useState([]);

  useEffect(() => {
    setQueryParams({
      folder: folder,
      page: page,
    });
  }, [page, folder, asPath]);

  const onChangeStatus = (invoice, status) => {
    invoice.folderValue = status;

    putDataApi('/invoice', infoViewActionsContext, { invoice })
      .then(() => {
        reCallAPI();
        infoViewActionsContext.showMessage(
          'Invoice status udpated successfully!',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };
  return !isEmptyObject(invoiceList) ? (
    <>
      <AppsHeader>
        <InvContentHeader
          page={page}
          invoiceList={invoiceList.data || []}
          checkedInvs={checkedInvs}
          setCheckedInvs={setCheckedInvs}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          onPageChange={onPageChange}
        />
      </AppsHeader>
      <AppsContent>
        <InvoiceTable
          invoiceData={invoiceList.data || []}
          loading={loading}
          onChangeStatus={onChangeStatus}
        />
      </AppsContent>
    </>
  ) : (
    <AppLoader />
  );
};

export default InvoiceList;
