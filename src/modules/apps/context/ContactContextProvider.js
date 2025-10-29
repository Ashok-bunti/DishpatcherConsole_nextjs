'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { useParams, useRouter } from 'next/navigation';

const ContactContext = createContext();
const ContactActionsContext = createContext();

export const useContactContext = () => useContext(ContactContext);

export const useContactActionsContext = () => useContext(ContactActionsContext);

export const ContactContextProvider = ({ children }) => {
  const params = useParams();
  const { all } = params;
  const [{ apiData: labelList }] = useGetDataApi('/contact/labels', []);

  const [{ apiData: folderList }] = useGetDataApi('/contact/folders', []);

  const [pageView, setPageView] = useState('list');

  const [page, setPage] = useState(0);

  const [
    { apiData: contactList, loading },
    { setQueryParams, setData: setContactData, reCallAPI },
  ] = useGetDataApi('/contact', {}, {}, false);

  useEffect(() => {
    setPage(0);
  }, [all]);

  useEffect(() => {
    setQueryParams({
      type: all[0],
      name: all[1],
      page: page,
    });
  }, [all, page]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const onChangePageView = (view) => {
    setPageView(view);
  };

  return (
    <ContactContext.Provider
      value={{
        all,
        labelList,
        folderList,
        contactList,
        loading,
        page,
        pageView,
      }}
    >
      <ContactActionsContext.Provider
        value={{
          setContactData,
          onPageChange,
          reCallAPI,
          setPageView,
          onChangePageView,
        }}
      >
        {children}
      </ContactActionsContext.Provider>
    </ContactContext.Provider>
  );
};
export default ContactContextProvider;

ContactContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
