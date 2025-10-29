import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import AppSearchBar from '../../../AppSearchBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppNotifications from '../../../AppNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppTooltip from '../../../AppTooltip';
import { alpha } from '@mui/material/styles';
import AppLogo from '../../components/AppLogo';
import UserInfo from '../../components/UserInfo';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index';
import {
  FormControl,
  Select,
  MenuItem as SelectMenuItem,
  Typography,
  Divider,
  Tooltip
} from "@mui/material"

import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import SyncIcon from '@mui/icons-material/Sync'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AdvancedSearchIcon from "@mui/icons-material/FilterList"
import {
  setSelectedAccount,
  setSearchTerm,
  clearAllSearches
} from '../../../../../store/slices/driverLocationSlice'
import AdvancedSearch from '../../../../../components/shared/AdvancedSearch'

const AppHeader = ({ toggleNavCollapsed, onStatsClick, onJobsCountClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchInput, setSearchInput] = useState("")
  const [activeSearch, setActiveSearch] = useState(false)
  const [advancedSearchAnchorEl, setAdvancedSearchAnchorEl] = useState(null)
  const [accounts, setAccounts] = useState([])

  const dispatch = useAppDispatch()

  const {
    selectedAccount,
    timeData,
    searchTerm,
    accountData,
    autoAiConfig,
    semiAutoAiConfig
  } = useAppSelector((state) => state.driverLocation)

  useEffect(() => {
    if (accountData && accountData.length > 0) {
      const mappedAccounts = accountData.map(account => ({
        id: account.id || account.name,
        name: account.name
      }))
      setAccounts(mappedAccounts)
    }
  }, [accountData])

  useEffect(() => {
    setSearchInput(searchTerm)
    setActiveSearch(searchTerm !== "")
  }, [searchTerm])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
  }

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      setActiveSearch(true)
      dispatch(setSearchTerm(searchInput))
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchInput("")
    dispatch(setSearchTerm(""))
    setActiveSearch(false)
    dispatch(clearAllSearches())
  }

  const handleAccountChange = (accountName) => {
    dispatch(setSelectedAccount(accountName))
  }

  const autoAiFlag = autoAiConfig
  const semiAutoAiFlag = semiAutoAiConfig

  return (
    <AppBar
      color='inherit'
      sx={(theme) => ({
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        transition: 'width 0.5s ease',
        width: '100%',
      })}
      className='app-bar'
    >
      <Toolbar
        sx={{
          boxSizing: 'border-box',
          minHeight: { xs: 56, sm: 70 },
          paddingLeft: { xs: 2.5, md: 5 },
          paddingRight: { xs: 2.5, md: 5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <IconButton
            sx={{
              color: 'text.secondary',
              display: { lg: 'none', xs: 'block' },
              padding: { xs: 0.5 }
            }}
            edge='start'
            className='menu-btn'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleNavCollapsed}
            size='small'
          >
            <MenuIcon
              sx={{
                width: 22,
                height: 22,
              }}
            />
          </IconButton>

          <Box
            sx={{
              '& .logo-text': {
                display: { xs: 'none', sm: 'block' },
              },
            }}
          >
            <AppLogo />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 4,
            flexWrap: 'wrap'
          }}
        >
          {timeData && timeData.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h4"
                sx={{ color: "#1B2064", fontWeight: "bold", mr: 2, fontSize: "1.2rem" }}
              >
                {timeData[0].name}: {timeData[0].formattedTime}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "#1B2064", fontWeight: "medium", fontSize: "0.9rem" }}
              >
                {timeData[0].zone}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              minHeight: 40,
              position: 'relative',
              display: { xs: 'none', sm: 'block' },
              '& .searchRoot': {
                position: { xs: 'relative' },
                right: { xs: 'auto' },
                top: { xs: 'auto' },
              },
            }}
          >
            <AppSearchBar
              iconPosition='right'
              placeholder='Search by PO number'
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              showClear={activeSearch}
              onClearClick={handleClearSearch}
            />
          </Box>

          <Tooltip title="Advanced Search">
            <IconButton
              sx={{
                color: '#1B2064',
                '&:hover': {
                  backgroundColor: 'rgba(27, 32, 100, 0.04)',
                },
                display: { xs: 'none', sm: 'flex' }
              }}
              onClick={(e) => setAdvancedSearchAnchorEl(e.currentTarget)}
            >
              <AdvancedSearchIcon />
            </IconButton>
          </Tooltip>

          {accounts && accounts.length > 0 && (
            <Box sx={{ width: 100, display: { xs: 'none', md: 'block' } }}>
              <FormControl fullWidth size="small" variant="outlined">
                <Select
                  value={selectedAccount || ""}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  sx={{
                    height: "36px",
                    fontSize: "0.875rem",
                    "& .MuiSelect-select": {
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    },
                  }}
                  disabled={accounts.length === 0}
                >
                  {accounts.map((account) => (
                    <SelectMenuItem key={account.id} value={account.name} sx={{ fontSize: "0.875rem" }}>
                      {account.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: "center", gap: 1 }}>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 3 }} />

            <Tooltip title="Live Data Inputs Enabled">
              <IconButton sx={{ color: '#3d8b40' }}>
                <SyncIcon sx={{ fontSize: '120%' }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 3 }} />

            <Tooltip title="Pending AI Calls">
              <IconButton sx={{ color: '#0000ff' }}>
                <PhoneInTalkIcon sx={{ fontSize: '120%' }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 3 }} />

            {onJobsCountClick && (
              <>
                <WorkHistoryIcon
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    fontSize: "2rem",
                    color: '#9B1FE9',
                    cursor: 'pointer'
                  }}
                  onClick={onJobsCountClick}
                />
                <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 3 }} />
              </>
            )}

            {onStatsClick && (
              <>
                <IconButton
                  sx={{
                    padding: 1,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={onStatsClick}
                >
                  <QueryStatsIcon sx={{ fontSize: 24, color: '#1976d2' }} />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 3 }} />
              </>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                mb: 0,
                paddingX: '8px',
                height: '28px',
                border: `1px solid ${autoAiFlag ? '#3d8b40' : semiAutoAiFlag ? '#ff9800' : '#d32f2f'}`,
                borderRadius: '8px',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: autoAiFlag ? '#3d8b40' : semiAutoAiFlag ? '#ff9800' : '#d32f2f',
                  border: `1px solid ${autoAiFlag ? '#3d8b40' : semiAutoAiFlag ? '#ff9800' : '#d32f2f'}`,
                  boxShadow: `0 0 2px ${autoAiFlag ? '#3d8b40' : semiAutoAiFlag ? '#ff9800' : '#d32f2f'}`,
                  mr: 1.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: "16px",
                  color: autoAiFlag ? '#3d8b40' : semiAutoAiFlag ? '#ff9800' : '#d32f2f',
                }}
              >
                {autoAiFlag ? 'AUTO' : semiAutoAiFlag ? 'SEMI' : 'OFF'}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 4, display: { xs: 'none', sm: 'block' } }} />

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <AppNotifications />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", height: 20, mt: 4, display: { xs: 'none', sm: 'block' } }} />

          <Box
            sx={{
              mr: { xs: 4, sm: 0 },
              minWidth: { md: 220 },
              '& .user-info-view': {
                p: 0,
              },
              '& .user-info': {
                display: { xs: 'none', md: 'block' },
              },
            }}
          >
            <UserInfo />
          </Box>

          <Box
            sx={{
              position: 'relative',
              display: { sm: 'none', xs: 'flex' },
              alignItems: 'center',
              marginLeft: -2,
              marginRight: -2,
            }}
          >
            <Box
              sx={{
                px: 1.85,
              }}
            >
              <AppTooltip title='More'>
                <IconButton
                  sx={(theme) => ({
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.default,
                    border: 1,
                    borderColor: 'transparent',
                    '&:hover, &:focus': {
                      color: theme.palette.text.primary,
                      backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.9),
                      borderColor: (theme) =>
                        alpha(theme.palette.text.secondary, 0.25),
                    },
                  })}
                  onClick={handleClick}
                  size='large'
                >
                  <MoreVertIcon />
                </IconButton>
              </AppTooltip>
            </Box>
          </Box>

          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <AppNotifications isMenu />
            </MenuItem>
            <MenuItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SyncIcon sx={{ color: '#3d8b40' }} />
                <Typography>Live Data</Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneInTalkIcon sx={{ color: '#0000ff' }} />
                <Typography>AI Calls</Typography>
              </Box>
            </MenuItem>
            {onJobsCountClick && (
              <MenuItem onClick={onJobsCountClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkHistoryIcon sx={{ color: '#9B1FE9' }} />
                  <Typography>Jobs Count</Typography>
                </Box>
              </MenuItem>
            )}
            {onStatsClick && (
              <MenuItem onClick={onStatsClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QueryStatsIcon sx={{ color: '#1976d2' }} />
                  <Typography>Statistics</Typography>
                </Box>
              </MenuItem>
            )}
          </Menu>

          <AdvancedSearch
            open={Boolean(advancedSearchAnchorEl)}
            anchorEl={advancedSearchAnchorEl}
            onClose={() => setAdvancedSearchAnchorEl(null)}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  toggleNavCollapsed: PropTypes.func,
  onStatsClick: PropTypes.func,
  onJobsCountClick: PropTypes.func,
};

export default AppHeader;