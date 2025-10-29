'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks/index'
import {
    Popover,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { setSearchType, setAdvancedSearchParams, setSearchTerm } from '../../store/slices/driverLocationSlice'

const AdvancedSearch = ({ open, anchorEl, onClose }) => {
    const dispatch = useAppDispatch()
    const { advancedSearchParams } = useAppSelector((state) => state.driverLocation)

    const [localParams, setLocalParams] = useState(advancedSearchParams)

    const handleParamChange = (field, value) => {
        setLocalParams(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSearch = () => {
        dispatch(setAdvancedSearchParams(localParams))
        dispatch(setSearchType('advanced'))
        dispatch(setSearchTerm(localParams))
        onClose()
    }

    const handleClear = () => {
        const emptyParams = {
            phone: '',
            po: '',
            vehicle: '',
            startDate: '',
            endDate: ''
        }
        setLocalParams(emptyParams)
        dispatch(setAdvancedSearchParams(emptyParams))
        dispatch(setSearchType('basic'))
        dispatch(setSearchTerm(''))
    }

    const hasActiveSearch = Object.values(localParams).some(value => value !== '')

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    width: 400,
                    p: 3
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Advanced Search
                </Typography>
                {hasActiveSearch && (
                    <Button
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        size="small"
                        color="inherit"
                    >
                        Clear
                    </Button>
                )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        value={localParams.phone}
                        onChange={(e) => handleParamChange('phone', e.target.value)}
                        placeholder="Enter customer phone number"
                        size="small"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="PO Number"
                        value={localParams.po}
                        onChange={(e) => handleParamChange('po', e.target.value)}
                        placeholder="Enter purchase order number"
                        size="small"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Vehicle"
                        value={localParams.vehicle}
                        onChange={(e) => handleParamChange('vehicle', e.target.value)}
                        placeholder="Enter vehicle make/model"
                        size="small"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={localParams.startDate}
                        onChange={(e) => handleParamChange('startDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={localParams.endDate}
                        onChange={(e) => handleParamChange('endDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={!Object.values(localParams).some(value => value !== '')}
                >
                    Search
                </Button>
            </Box>

            <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Search across multiple fields simultaneously. Leave fields empty to ignore them.
                </Typography>
            </Box>
        </Popover>
    )
}

export default AdvancedSearch