'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { useParams, usePathname } from 'next/navigation';

const MailContext = createContext();
const MailActionsContext = createContext();

export const useMailContext = () => useContext(MailContext);

export const useMailActionsContext = () => useContext(MailActionsContext);

export const MailContextProvider = ({ children }) => {
  const params = useParams();
  const pathname = usePathname();
  const { all } = params;
  let url = pathname.split('/');
  let folders = url[url.length - 1];
  let folder;
  let label;
  if (all.length === 2 && !+all[1] > 0) {
    label = all[1];
  } else if (all.length === 1) {
    folder = all[0];
  }

  const [{ apiData: labelList }] = useGetDataApi('/mail/labels');
  const [{ apiData: connectionList }] = useGetDataApi('/mail/connection');
  const [{ apiData: folderList }] = useGetDataApi('/mail/folders');
  const [page, setPage] = useState(0);

  const [
    { apiData: mailList, loading },
    { setQueryParams, setData: setMailData, reCallAPI },
  ] = useGetDataApi(
    '/mail',
    undefined,
    {
      type: folder ? 'folder' : 'label',
      name: folder || label,
      page: page,
    },
    false,
  );

  useEffect(() => {
    setPage(0);
  }, [pathname]);
  useEffect(() => {
    setQueryParams({
      type: folder ? 'folder' : 'label',
      name: folder || label,
      page,
    });
  }, [page, pathname]);

  const onPageChange = (event, value) => {
    setPage(value);
  };
  return (
    <MailContext.Provider
      value={{
        all,
        folder,
        label,
        labelList,
        connectionList,
        folderList,
        mailList,
        loading,
        page,
      }}
    >
      <MailActionsContext.Provider
        value={{
          setMailData,
          onPageChange,
          reCallAPI,
        }}
      >
        {children}
      </MailActionsContext.Provider>
    </MailContext.Provider>
  );
};
export default MailContextProvider;

MailContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
