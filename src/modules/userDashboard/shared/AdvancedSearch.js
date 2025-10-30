'use client';
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Grid,
  Popper,
  Fade
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAppDispatch, useAppSelector } from "../../../../src/store/hooks/index";
import { 
  setAdvancedSearchParams, 
  setSearchTerm, 
  clearAllSearches,
  setSearchType
} from "../../../../src/store/slices/driverLocationSlice";
import moment from "moment";
import AppCard from "@crema/components/AppCard";

const AdvancedSearch = ({ open, anchorEl, onClose }) => {
  const dispatch = useAppDispatch();
  const { advancedSearchParams } = useAppSelector((state) => state.driverLocation);
  
  const popoverRef = useRef(null);
  
  const yesterday = moment().subtract(1, 'days');
  const formattedYesterday = yesterday.format('YYYY-MM-DD');
  const currentDate = new Date().toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    phone: "",
    po: "",
    vehicle: "",
    startDate: formattedYesterday,
    startTime: "00:00:00",
    endDate: currentDate,
    endTime: "23:59:00"
  });

  useEffect(() => {
    if (advancedSearchParams.phone || advancedSearchParams.po || advancedSearchParams.vehicle) {
      setSearchParams(prev => ({
        ...prev,
        phone: advancedSearchParams.phone || "",
        po: advancedSearchParams.po || "",
        vehicle: advancedSearchParams.vehicle || "",
        startDate: advancedSearchParams.startDate ? advancedSearchParams.startDate.split('T')[0] : formattedYesterday,
        endDate: advancedSearchParams.endDate ? advancedSearchParams.endDate.split('T')[0] : currentDate
      }));
    }
  }, [advancedSearchParams, formattedYesterday, currentDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const combineDateTime = (date, time) => {
    if (!date) return '';
    if (!time) return `${date} 00:00:00`;
    return `${date} ${time}`;
  };

  const handleSearch = async () => {
    try {
      const startDateTime = combineDateTime(searchParams.startDate, searchParams.startTime);
      const endDateTime = combineDateTime(searchParams.endDate, searchParams.endTime);

      const apiSearchParams = {
        phone: searchParams.phone,
        po: searchParams.po,
        vehicle: searchParams.vehicle,
        startDate: startDateTime,
        endDate: endDateTime
      };

      dispatch(setSearchType('advanced'));
      dispatch(setAdvancedSearchParams(apiSearchParams));
      dispatch(setSearchTerm('__ADVANCED_SEARCH_ACTIVE__'));

      onClose();
    } catch (error) {
      // Error handling can be implemented here
    }
  };

  const handleRefresh = () => {
    setSearchParams({
      phone: "",
      po: "",
      vehicle: "",
      startDate: formattedYesterday,
      startTime: "00:00:00",
      endDate: currentDate,
      endTime: "23:59:00"
    });

    dispatch(clearAllSearches());
  };

  const getCurrentDate = () => {
    return currentDate;
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition
      sx={{
        zIndex: 1300,
        marginTop: '8px',
        marginLeft: '8px'
      }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <AppCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: 'text.primary'
                }}
              >
                <FilterListIcon sx={{ mr: 1, color: '#1B2064' }} />
                Advanced Search
              </Typography>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Phone"
                value={searchParams.phone}
                onChange={(e) => handleSearchParamChange('phone', e.target.value)}
                placeholder="Enter phone number"
                size="small"
                fullWidth
                variant="outlined"
              />

              <TextField
                label="PO Number"
                value={searchParams.po}
                onChange={(e) => handleSearchParamChange('po', e.target.value)}
                placeholder="Enter PO number"
                size="small"
                fullWidth
                variant="outlined"
              />

              <TextField
                label="Vehicle"
                value={searchParams.vehicle}
                onChange={(e) => handleSearchParamChange('vehicle', e.target.value)}
                placeholder="Enter vehicle details"
                size="small"
                fullWidth
                variant="outlined"
              />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Start Date & Time
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={searchParams.startDate}
                    onChange={(e) => handleSearchParamChange('startDate', e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: getCurrentDate()
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={searchParams.startTime}
                    onChange={(e) => handleSearchParamChange('startTime', e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!searchParams.startDate}
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                End Date & Time
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={searchParams.endDate}
                    onChange={(e) => handleSearchParamChange('endDate', e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: getCurrentDate()
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="End Time"
                    type="time"
                    value={searchParams.endTime}
                    onChange={(e) => handleSearchParamChange('endTime', e.target.value)}
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!searchParams.endDate}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 4, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  flex: 1,
                  backgroundColor: '#1B2064',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#15184d'
                  }
                }}
              >
                Search
              </Button>
            </Box>
          </AppCard>
        </Fade>
      )}
    </Popper>
  );
};

export default AdvancedSearch;