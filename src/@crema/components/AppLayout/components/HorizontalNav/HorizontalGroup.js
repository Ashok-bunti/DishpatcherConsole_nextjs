import React, { useState } from 'react';
import {
  Grow,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Manager, Popper } from 'react-popper';
import Box from '@mui/material/Box';
import HorizontalCollapse from './HorizontalCollapse';
import HorizontalItem from './HorizontalItem';
import { usePathname } from 'next/navigation';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import { allowMultiLanguage } from '@crema/constants/AppConst';
import { isUrlInChildren } from '@crema/helpers/RouteHelper';

const HorizontalGroup = (props) => {
  const [opened, setOpened] = useState(false);
  const { item, nestedLevel } = props;
  const pathname = usePathname();
  const itemRef = React.useRef(null);

  const handleToggle = (open) => {
    setOpened(open);
  };

  return (
    <Manager>
      <ListItemButton
        ref={itemRef}
        className={clsx('navItem', isUrlInChildren(item, pathname) && 'active')}
        onMouseEnter={() => handleToggle(true)}
        onMouseLeave={() => handleToggle(false)}
      >
        {item.icon && (
          <Icon color='action' className='navLinkIcon'>
            {item.icon}
          </Icon>
        )}

        <ListItemText
          primary={
            allowMultiLanguage ? (
              <IntlMessages id={item.messageId} />
            ) : (
              item.title
            )
          }
          sx={{
            fontWeight: Fonts.MEDIUM,
          }}
        />
        {nestedLevel > 0 && (
          <IconButton
            sx={{
              ml: 2,
            }}
            disableRipple
          >
            <Icon
              sx={{
                fontSize: 18,
              }}
              className='arrow-icon'
            >
              keyboard_arrow_right
            </Icon>
          </IconButton>
        )}
      </ListItemButton>
      {opened && (
        <Popper
          placement={nestedLevel === 0 ? 'bottom-start' : 'right'}
          referenceElement={itemRef.current}
        >
          {({ ref, style, placement }) => (
            <Box
              ref={ref}
              sx={{
                ...style,
                boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.2)',
                zIndex: 1110 + nestedLevel,
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
                style={{ transformOrigin: '0 0 0' }}
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
                              nestedLevel={nestedLevel}
                            />
                          )}

                          {item.type === 'collapse' && (
                            <HorizontalCollapse
                              item={item}
                              nestedLevel={nestedLevel}
                            />
                          )}

                          {item.type === 'item' && (
                            <HorizontalItem
                              item={item}
                              nestedLevel={nestedLevel}
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
  );
};

HorizontalGroup.propTypes = {
  item: PropTypes.object,
  nestedLevel: PropTypes.number,
};

export default HorizontalGroup;
