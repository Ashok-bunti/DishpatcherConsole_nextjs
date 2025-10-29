import ContactListItem from './ContactListItem';
import Box from '@mui/material/Box';
import ContactGridItem from './ContactGridItem';
import React from 'react';
import PropTypes from 'prop-types';
import AppList from '@crema/components/AppList';
import AppGrid from '@crema/components/AppGrid';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import IntlMessages from '@crema/helpers/IntlMessages';
import ContactListSkeleton from '@crema/components/AppSkeleton/ContactListSkeleton';
import ContactListItemMobile from './ContactListItem/ContactListItemMobile';
import { useGetDataApi } from '@crema/hooks/APIHooks';

const ContactView = (props) => {
  const {
    list = [],
    checkedContacts = [],
    pageView,
    loading,
    handleAddContactOpen,
    onChangeStarred,
    onChangeCheckedContacts,
    onSelectContactsForDelete,
    onOpenEditContact,
    onViewContactDetail,
  } = props;
  const [{ apiData: labelList }] = useGetDataApi('/contact/labels', []);

  return (
    <>
      {pageView === 'list' ? (
        <>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <AppList
              data={list}
              animation='transition.slideUpIn'
              sx={{
                pt: 0,
                pb: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              ListEmptyComponent={
                <ListEmptyResult
                  loading={loading}
                  actionTitle={<IntlMessages id='contactApp.createContact' />}
                  onClick={handleAddContactOpen}
                  placeholder={<ContactListSkeleton />}
                />
              }
              renderRow={(contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  labelList={labelList}
                  onChangeCheckedContacts={onChangeCheckedContacts}
                  checkedContacts={checkedContacts}
                  onSelectContactsForDelete={onSelectContactsForDelete}
                  onChangeStarred={onChangeStarred}
                  onViewContactDetail={onViewContactDetail}
                  onOpenEditContact={onOpenEditContact}
                />
              )}
            />
          </Box>

          <Box sx={{ display: { sm: 'none', xs: 'block' } }}>
            <AppList
              data={list}
              animation='transition.slideUpIn'
              sx={{
                pt: 0,
                pb: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              ListEmptyComponent={
                <ListEmptyResult
                  loading={loading}
                  actionTitle={<IntlMessages id='contactApp.createContact' />}
                  onClick={handleAddContactOpen}
                  placeholder={<ContactListSkeleton />}
                />
              }
              renderRow={(contact) => (
                <ContactListItemMobile
                  key={contact.id}
                  contact={contact}
                  checkedContacts={checkedContacts}
                  labelList={labelList}
                  onChangeStarred={onChangeStarred}
                  onViewContactDetail={onViewContactDetail}
                  onOpenEditContact={onOpenEditContact}
                />
              )}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            px: 5,
            pt: 0.5,
            pb: 3,
          }}
        >
          <AppGrid
            responsive={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 2,
              xl: 3,
            }}
            data={list}
            renderRow={(contact) => (
              <ContactGridItem
                key={contact.id}
                contact={contact}
                labelList={labelList}
                onChangeCheckedContacts={onChangeCheckedContacts}
                checkedContacts={checkedContacts}
                onChangeStarred={onChangeStarred}
                onSelectContactsForDelete={onSelectContactsForDelete}
                onViewContactDetail={onViewContactDetail}
                onOpenEditContact={onOpenEditContact}
              />
            )}
          />
        </Box>
      )}
    </>
  );
};

export default ContactView;

ContactView.propTypes = {
  list: PropTypes.array,
  pageView: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  handleAddContactOpen: PropTypes.func,
  checkedContacts: PropTypes.array,
  onChangeCheckedContacts: PropTypes.func,
  onChangeStarred: PropTypes.func,
  onSelectContactsForDelete: PropTypes.func,
  onOpenEditContact: PropTypes.func,
  onViewContactDetail: PropTypes.func,
};
