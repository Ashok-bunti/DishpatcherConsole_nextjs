import React from 'react';
import { Icon, ListItemButton, ListItemText } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Badge from '@mui/material/Badge';
import { usePathname } from 'next/navigation';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import IntlMessages from '@crema/helpers/IntlMessages';
import { isUrlInChildren } from '@crema/helpers/RouteHelper';
import { allowMultiLanguage } from '@crema/constants/AppConst';

const HorizontalItem = (props) => {
  const { item, dense } = props;
  const pathname = usePathname();
  const active = isUrlInChildren(item, pathname);
  const { sidebarMenuSelectedBgColor, sidebarMenuSelectedTextColor } =
    useSidebarContext();

  return (
    <Link href={item.url} as={item.as} style={{ textDecoration: 'none' }}>
      <ListItemButton
        className={clsx('navItemSubmenu', dense && 'dense', {
          active: item.url === pathname,
        })}
        exact={item.exact}
        sx={(theme) => ({
          minHeight: 40,
          padding: '4px 12px',
          color: theme.palette.text.primary,
          textDecoration: 'none !important',
          minWidth: 160,
          '&.active': {
            backgroundColor: sidebarMenuSelectedBgColor,
            color: sidebarMenuSelectedTextColor + '!important',
            pointerEvents: 'none',
            '& .list-item-text-primary': {
              color: 'inherit',
            },
            '& .list-item-icon': {
              color: 'inherit',
            },
          },
          '& .list-item-text': {
            padding: '0 0 0 16px',
          },
          '&.dense': {
            padding: '4px 12px',
            minHeight: 40,
            '& .list-item-text': {
              padding: '0 0 0 8px',
            },
          },
        })}
      >
        {item.icon && (
          <Icon
            sx={[
              {
                mr: 3,
                fontSize: { xs: 16, xl: 18 },
              },
              active
                ? {
                    color: sidebarMenuSelectedTextColor,
                  }
                : {
                    color: 'action',
                  },
            ]}
          >
            {item.icon}
          </Icon>
        )}
        <ListItemText
          className='AppNavLinkTextSubmenu'
          sx={{ textDecoration: 'none !important', listStyleType: 'none' }}
          primary={
            allowMultiLanguage ? (
              <IntlMessages id={item.messageId} />
            ) : (
              item.title
            )
          }
        />
        {item.count && (
          <Box
            sx={{
              ml: 4,
            }}
          >
            <Badge
              count={item.count}
              sx={{
                color: item.color,
              }}
            />
          </Box>
        )}
      </ListItemButton>
    </Link>
  );
};

export default HorizontalItem;

HorizontalItem.propTypes = {
  item: PropTypes.object,
  dense: PropTypes.bool,
};
