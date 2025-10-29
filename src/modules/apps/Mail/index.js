'use client';
import React from 'react';
import MailsList from './MailsList';
import PropTypes from 'prop-types';
import AppsContainer from '@crema/components/AppsContainer';
import { useIntl } from 'react-intl';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MailContextProvider from '../context/MailContextProvider';
import MailSidebar from './MailSideBar';
import MailDetail from './MailDetail';
import clsx from 'clsx';

const MailDetailViewWrapper = styled(Box)(({ theme }) => {
  return {
    transition: 'all 0.5s ease',
    transform: 'translateX(100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    opacity: 0,
    visibility: 'hidden',
    backgroundColor: theme.palette.background.paper,
    '&.show': {
      transform: 'translateX(0)',
      opacity: 1,
      visibility: 'visible',
    },
  };
});

const Mail = () => {
  const { messages } = useIntl();
  const params = useParams();
  return (
    <MailContextProvider>
      <AppsContainer
        title={messages['mailApp.mail']}
        sidebarContent={<MailSidebar />}
      >
        <MailsList />
        <MailDetailViewWrapper
          className={clsx({
            show: params.all[params.all.length - 1] > 0,
          })}
        >
          <MailDetail show={params.all[params.all.length - 1] > 0} />
        </MailDetailViewWrapper>
      </AppsContainer>
    </MailContextProvider>
  );
};

export default Mail;

Mail.propTypes = {
  match: PropTypes.object,
};
