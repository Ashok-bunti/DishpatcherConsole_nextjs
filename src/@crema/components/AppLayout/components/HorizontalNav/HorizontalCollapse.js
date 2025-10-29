import React, { useRef, useState } from 'react';
import { Grow, Icon, IconButton, ListItemText, Paper } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Manager, Popper, Reference } from 'react-popper';
import HorizontalItem from './HorizontalItem';
import HorizontalGroup from './HorizontalGroup';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { usePathname } from 'next/navigation';
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import IntlMessages from '@crema/helpers/IntlMessages';
import { allowMultiLanguage } from '@crema/constants/AppConst';
import { isUrlInChildren } from '@crema/helpers/RouteHelper';

import ListItemButton from '@mui/material/ListItemButton';

const HorizontalCollapse = (props) => {
  const [opened, setOpened] = useState(false);
  const { theme } = useThemeContext();
  const pathname = usePathname();
  const { item, nestedLevel, dense } = props;
  const active = isUrlInChildren(item, pathname);
  const { sidebarMenuSelectedBgColor, sidebarMenuSelectedTextColor } =
    useSidebarContext();
  const buttonRef = useRef(null);

  const handleToggle = (open) => {
    setOpened(open);
  };

  return (
    <List
      sx={{
        py: 0,
        '& .list-item-text': {
          padding: '0 0 0 16px',
        },
      }}
      className='navbarNavSubmenu'
    >
      <Manager>
        <ListItemButton
          ref={buttonRef}
          sx={{
            color: theme.palette.text.primary,
            padding: '0px 12px',
            '&.active, &.active:hover, &.active:focus': {
              backgroundColor: sidebarMenuSelectedBgColor + '!important',
              color: sidebarMenuSelectedTextColor + '!important',
            },
            '&.open': {
              backgroundColor: 'rgba(0,0,0,.08)',
            },
            '&.dense': {
              padding: '0px 12px',
              '& .list-item-text': {
                padding: '0 0 0 8px',
              },
            },
          }}
          className={clsx(
            'navItemSubmenu',
            opened && 'open',
            dense && 'dense',
            active && 'active',
          )}
          onMouseEnter={() => handleToggle(true)}
          onMouseLeave={() => handleToggle(false)}
          aria-owns={opened ? 'menu-list-grow' : null}
          aria-haspopup='true'
        >
          {item.icon && (
            <Icon
              sx={{
                color: active ? sidebarMenuSelectedTextColor : 'action',
                mr: 3.5,
                fontSize: { xs: 16, xl: 18 },
              }}
            >
              {item.icon}
            </Icon>
          )}
          <ListItemText
            className='navLinkTextSubmenu'
            primary={
              allowMultiLanguage ? (
                <IntlMessages id={item.messageId} />
              ) : (
                item.title
              )
            }
          />
          <Box p={0}>
            <IconButton disableRipple>
              <Icon
                sx={{
                  color: active ? sidebarMenuSelectedTextColor : 'action',
                }}
              >
                {theme.direction === 'ltr' ? 'chevron_right' : 'chevron_left'}
              </Icon>
            </IconButton>
          </Box>
        </ListItemButton>
        {opened && (
          <Popper placement='right' referenceElement={buttonRef.current}>
            {({ ref, style, placement }) => (
              <Box
                ref={ref}
                sx={{
                  boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.2)',
                  zIndex: 1110 + nestedLevel + 1,
                  ...style,
                  '& .popperClose': {
                    pointerEvents: 'none',
                  },
                }}
                data-placement={placement}
                className={clsx({
                  popperClose: !opened,
                })}
              >
                <Grow
                  in={opened}
                  id='menu-list-grow'
                  sx={{ transformOrigin: '0 0 0' }}
                >
                  <Paper
                    onMouseEnter={() => handleToggle(true)}
                    onMouseLeave={() => handleToggle(false)}
                  >
                    {item.children && (
                      <List
                        sx={{
                          px: 0,
                        }}
                      >
                        {item.children.map((item) => (
                          <React.Fragment key={item.id}>
                            {item.type === 'group' && (
                              <HorizontalGroup
                                item={item}
                                nestedLevel={nestedLevel + 1}
                              />
                            )}

                            {item.type === 'collapse' && (
                              <HorizontalCollapse
                                item={item}
                                nestedLevel={nestedLevel + 1}
                              />
                            )}
                            {item.type === 'item' && (
                              <HorizontalItem
                                item={item}
                                nestedLevel={nestedLevel + 1}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Grow>
              </Box>
            )}
          </Popper>
        )}
      </Manager>
    </List>
  );
};

export default HorizontalCollapse;

HorizontalCollapse.propTypes = {
  item: PropTypes.object,
  nestedLevel: PropTypes.number,
  dense: PropTypes.number,
};
