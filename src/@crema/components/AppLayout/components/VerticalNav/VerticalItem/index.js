import React from 'react';
import { Icon, ListItemText } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Box from '@mui/material/Box';
import VerticalNavItem from './VerticalNavItem';
import { useAuthUser } from '../../../../../hooks/AuthHooks';
import { checkPermission } from '@crema/helpers/RouteHelper';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppBadge from '../../../../AppBadge';
import { allowMultiLanguage } from '@crema/constants/AppConst';

const VerticalItem = ({ level, router, item }) => {
  const { user } = useAuthUser();
  const hasPermission =
    () => checkPermission(item.permittedRole, user?.role);
  if (!hasPermission) {
    return null;
  }
  return (
    <Link href={item.url} as={item.as} style={{ textDecoration: 'none' }}>
      <VerticalNavItem
        item={item}
        level={level}
        router={router}
        exact={item.exact}
      >
        {item.icon && (
          <Box component='span'>
            <Icon
              sx={{
                fontSize: 18,
                display: 'block',
                mr: 4,
              }}
              className={clsx('nav-item-icon', 'material-icons-outlined')}
              color='action'
            >
              {item.icon}
            </Icon>
          </Box>
        )}
        <ListItemText
          className='nav-item-content'
          primary={
            allowMultiLanguage ? (
              <IntlMessages id={item.messageId} />
            ) : (
              item.title
            )
          }
          classes={{ primary: 'nav-item-text' }}
        />
        {item.count && (
          <Box sx={{ mr: 3.5 }} className='menu-badge'>
            <AppBadge count={item.count} color={item.color} />
          </Box>
        )}
      </VerticalNavItem>
    </Link>
  );
};

VerticalItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    permittedRole: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    exact: PropTypes.bool,
    messageId: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    url: PropTypes.string,
    color: PropTypes.string,
    as: PropTypes.string,
  }),
  level: PropTypes.number,
  router: PropTypes.object,
};

export default VerticalItem;
