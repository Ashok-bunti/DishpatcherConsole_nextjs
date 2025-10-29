import React, { useEffect, useState } from 'react';
import MailContentHeader from './MailContentHeader';
import { Box } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import AppsPagination from '@crema/components/AppsPagination';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppsFooter from '@crema/components/AppsContainer/AppsFooter';
import AppList from '@crema/components/AppList';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import EmailListSkeleton from '@crema/components/AppSkeleton/EmailListSkeleton';
import MailListItemMobile from './MailListItemMobile';
import MailListItem from './MailListItem';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';

const MailsList = () => {
  const infoViewActionsContext = useInfoViewActionsContext();
  const router = useRouter();
  const params = useParams();

  const pathname = usePathname();
  let url = pathname.split('/');
  let folders = url[url.length - 1];

  const { all } = params;
  let folder;
  let label;
  if (all.length === 2 && !+all[1] > 0) {
    label = all[1];
  } else if (all.length === 1) {
    folder = all[0];
  }

  const [page, setPage] = useState(0);

  const [{ apiData, loading }, { setQueryParams, setData }] = useGetDataApi(
    'mail',
    undefined,
    {
      type: folder ? 'folder' : 'label',
      name: folder || label,
      page: page,
    },
    false,
  );

  const [{ apiData: labelList }] = useGetDataApi('mail/labels');
  const [checkedMails, setCheckedMails] = useState([]);

  const [filterText, onSetFilterText] = useState('');

  useEffect(() => {
    setPage(0);
  }, [pathname]);

  useEffect(() => {
    if (folder || label)
      setQueryParams({
        type: folder ? 'folder' : 'label',
        name: folder || label,
        page: page,
        checkedMails: checkedMails,
      });
  }, [page, pathname, checkedMails, folder, label]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const onChangeCheckedMails = (checked, id) => {
    if (checked) {
      setCheckedMails(checkedMails.concat(id));
    } else {
      setCheckedMails(checkedMails.filter((mailId) => mailId !== id));
    }
  };

  const onViewMailDetail = (mail) => {
    if (mail.isRead) {
      router.push(`/apps/mail/${all.join('/')}/${mail.id}`);
    } else {
      mail.isRead = true;
      putDataApi('mail/', infoViewActionsContext, { mail })
        .then((data) => {
          onUpdateItem(data);
          if (label) router.push(`/apps/mail/label/${label}/${mail.id}`);
          if (folder) router.push(`/apps/mail/${folder}/${mail.id}`);
          infoViewActionsContext.showMessage(
            mail.isRead
              ? 'Mail Marked as Read Successfully'
              : 'Mail Marked as Unread Successfully',
          );
        })
        .catch((error) => {
          infoViewActionsContext.fetchError(error.message);
        });
    }
  };

  const onChangeStarred = (checked, mail) => {
    mail.isStarred = checked;
    putDataApi('/mail/starred', infoViewActionsContext, {
      mail,
    })
      .then((data) => {
        onUpdateItem(data.data);
        infoViewActionsContext.showMessage(
          checked
            ? 'Mail Marked as Starred Successfully'
            : 'Mail Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onUpdateItem = (data) => {
    setData({
      data: apiData.data.map((item) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      }),
      count: apiData.count,
    });
  };

  const onGetFilteredMails = () => {
    if (filterText === '') {
      return apiData?.data;
    } else {
      return apiData?.data.filter(
        (mail) =>
          mail?.subject?.toLowerCase()?.includes(filterText.toLowerCase()) ||
          mail?.detail?.toLowerCase()?.includes(filterText.toLowerCase()),
      );
    }
  };

  const onRemoveItem = (data) => {
    setData({
      data: apiData?.data.filter((item) => item.id !== data.id),
      count: apiData?.count - 1,
    });
  };
  const list = onGetFilteredMails();
  return (
    <>
      <AppsHeader>
        <MailContentHeader
          checkedMails={checkedMails}
          setCheckedMails={setCheckedMails}
          onPageChange={onPageChange}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          page={page}
          path={pathname}
          setData={setData}
          mailList={list}
          totalMails={apiData?.count}
        />
      </AppsHeader>
      <AppsContent>
        <Box sx={{ display: { sm: 'block', xs: 'none' } }}>
          <AppList
            sx={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            data={list || []}
            ListEmptyComponent={
              <ListEmptyResult
                loading={loading}
                placeholder={<EmailListSkeleton />}
              />
            }
            renderRow={(mail) => (
              <MailListItem
                key={mail.id}
                mail={mail}
                labelList={labelList}
                onChangeCheckedMails={onChangeCheckedMails}
                checkedMails={checkedMails}
                onViewMailDetail={onViewMailDetail}
                onChangeStarred={onChangeStarred}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
              />
            )}
          />
        </Box>
        <Box sx={{ display: { sm: 'none', xs: 'block' } }}>
          <AppList
            sx={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            data={list || []}
            ListEmptyComponent={
              <ListEmptyResult
                loading={loading}
                placeholder={<EmailListSkeleton />}
              />
            }
            renderRow={(mail) => (
              <MailListItemMobile
                key={mail.id}
                mail={mail}
                labelList={labelList}
                checkedMails={checkedMails}
                onChangeCheckedMails={onChangeCheckedMails}
                onViewMailDetail={onViewMailDetail}
                onChangeStarred={onChangeStarred}
              />
            )}
          />
        </Box>
      </AppsContent>
      <Box sx={{ display: { sm: 'none', xs: 'block' } }}>
        {list?.length > 0 ? (
          <AppsFooter>
            <AppsPagination
              count={apiData?.count}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        ) : null}
      </Box>
    </>
  );
};
export default MailsList;
