import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
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
          <SearchIcon />
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