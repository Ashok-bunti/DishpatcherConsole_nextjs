import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  SearchIconBox,
  SearchIconWrapper,
  SearchInputBase,
  SearchWrapper,
} from './index.style';


const AppSearchBar = ({
  placeholder,
  iconPosition = 'left',
  align = 'left',
  overlap = true,
  onlyIcon = false,
  disableFocus,
  iconStyle = {
    color: 'grey',
  },
  value,
  onChange,
  onKeyPress,
  showClear = false,
  onClearClick,
  ...rest
}) => {

  const handleKeyPress = (event) => {
    if (onKeyPress) {
      onKeyPress(event);
    }
  };


  const handleClear = (event) => {
    event.stopPropagation();
    if (onClearClick) {
      onClearClick();
    }
  };

  return (
    <SearchWrapper sx={rest.sx} iconPosition={iconPosition}>
      <SearchIconBox
        align={align}
        className={clsx(
          'searchRoot',
          { 'hs-search': overlap },
          { 'hs-disableFocus': disableFocus },
          { searchIconBox: onlyIcon },
        )}
      >
        <SearchIconWrapper
          className={clsx({
            right: iconPosition === 'right',
            left: iconPosition === 'left',
          })}
          style={iconStyle}
        >
          {showClear ? (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                padding: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : (
            <SearchIcon />
          )}
        </SearchIconWrapper>
        <SearchInputBase
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || 'Search…'}
          inputProps={{ 'aria-label': 'search' }}
          {...rest}
        />
      </SearchIconBox>
    </SearchWrapper>
  );
};

export default AppSearchBar;

AppSearchBar.propTypes = {
  iconPosition: PropTypes.string,
  align: PropTypes.string,
  placeholder: PropTypes.string,
  overlap: PropTypes.bool,
  className: PropTypes.string,
  onlyIcon: PropTypes.bool,
  disableFocus: PropTypes.bool,
  iconStyle: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  showClear: PropTypes.bool,
  onClearClick: PropTypes.func,
};