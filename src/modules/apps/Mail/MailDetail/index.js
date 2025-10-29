import React, { createRef, useEffect } from 'react';
import MailDetailHeader from './MailDetailHeader';
import MailDetailBody from './MailDetailBody';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppAnimate from '@crema/components/AppAnimate';
import { MailDetailSkeleton } from '@crema/components/AppSkeleton/MailDetailSkeleton';
import Box from '@mui/material/Box';
import { useParams } from 'next/navigation';
import { useGetDataApi } from '@crema/hooks/APIHooks';

const MailDetail = ({ show }) => {
  const contentRef = createRef();
  const params = useParams();
  const { all } = params;

  const [{ apiData: selectedMail }, { setQueryParams, setData }] =
    useGetDataApi('/mail/detail', undefined, {}, false);

  const id = all.slice(-1)[0];
  useEffect(() => {
    if (show) {
      setQueryParams({ id });
    }
  }, [id, show]);

  const onUpdateSelectedMail = (data) => {
    setData(data);
  };

  if (!selectedMail) {
    return <MailDetailSkeleton />;
  }
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      ref={contentRef}
    >
      <AppsHeader>
        <MailDetailHeader
          selectedMail={selectedMail}
          onUpdateSelectedMail={onUpdateSelectedMail}
        />
      </AppsHeader>
      <AppsContent isDetailView>
        <AppAnimate animatoin='transition.slideUpIn'>
          <MailDetailBody
            selectedMail={selectedMail}
            key={'mail_detail'}
            onUpdateSelectedMail={onUpdateSelectedMail}
          />
        </AppAnimate>
      </AppsContent>
    </Box>
  );
};

export default MailDetail;
