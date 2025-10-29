'use client'

import React, { useState, useCallback, useMemo } from "react"
import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Alert,
    Divider,
    Snackbar
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import AppCard from '../../../../../../@crema/components/AppCard/index'
import { useVehicleDetails } from '../../../../../../services/towReportService'
import AppLoader from '../../../../../../@crema/components/AppLoader/index'

const VehicleDetailsSection = ({ row, onCopy }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')

    // Memoize the extracted vehicle name to prevent recalculation
    const extractedVehicleName = useMemo(() => {
        if (!row?.vehicle) return ""
        const words = row.vehicle.split(' ')
        return words.slice(0, Math.min(4, words.length)).join(' ')
    }, [row?.vehicle])

    const { 
        data: vehicleData, 
        isLoading: isProcessing, 
        error: fetchError 
    } = useVehicleDetails(extractedVehicleName || null)

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
    }, [])

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false)
    }, [])

    const handleCopyText = useCallback(async (text, label = 'Text') => {
        if (!text || text === "-") return

        try {
            await navigator.clipboard.writeText(text)
            showSnackbar(`${label} copied to clipboard!`, 'success')
            if (onCopy) {
                onCopy(`${label} copied to clipboard!`)
            }
        } catch (err) {
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()

            try {
                const successful = document.execCommand('copy')
                if (successful) {
                    showSnackbar(`${label} copied to clipboard!`, 'success')
                    if (onCopy) {
                        onCopy(`${label} copied to clipboard!`)
                    }
                }
            } catch (copyError) {
                showSnackbar('Failed to copy', 'error')
                if (onCopy) {
                    onCopy('Failed to copy')
                }
            } finally {
                document.body.removeChild(textArea)
            }
        }
    }, [onCopy, showSnackbar])

    const renderVehicleDetailField = useCallback((item, vehicle) => (
        <Grid item xs={12} sm={12} key={item.key}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex">
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            minWidth: 120,
                            color: "text.secondary",
                            mr: 2,
                        }}
                    >
                        {item.label}:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: "#1B2064",
                        }}
                    >
                        {vehicle[item.key] || "-"}
                    </Typography>
                </Box>
                {vehicle[item.key] && vehicle[item.key] !== "-" && (
                    <Tooltip title={`Copy ${item.label}`} arrow>
                        <IconButton
                            size="small"
                            sx={{ p: 0.3, flexShrink: 0 }}
                            onClick={() => handleCopyText(vehicle[item.key], item.label)}
                        >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Grid>
    ), [handleCopyText])

    const renderDatabaseVehicleDetails = useCallback((vehicle) => {
        const fields = [
            { key: "type", label: "Type" },
            { key: "category", label: "Category" },
            { key: "drivetrain", label: "Wheel Drive" },
            { key: "engine", label: "Engine" },
            { key: "fuelType", label: "Fuel Type" },
            { key: "seatingCapacity", label: "Seating Capacity" },
            { key: "transmission", label: "Transmission" },
            { key: "vehicleType", label: "Vehicle Type" },
        ]

        return (
            <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h2" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#1B2064',
                        fontSize: '1.5rem',
                        mb: 0
                    }}>
                        {extractedVehicleName || row.vehicle}
                    </Typography>
                    {(extractedVehicleName || row.vehicle) && (extractedVehicleName !== "-" && row.vehicle !== "-") && (
                        <Tooltip title="Copy Vehicle Name" arrow>
                            <IconButton
                                size="small"
                                sx={{
                                    p: 0.3,
                                    flexShrink: 0,
                                    color: "#1B2064",
                                    "&:hover": {
                                        backgroundColor: "rgba(27, 32, 100, 0.1)"
                                    }
                                }}
                                onClick={() => handleCopyText(extractedVehicleName || row.vehicle, "Vehicle Name")}
                            >
                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {fields.map((item) =>
                        vehicle[item.key] && renderVehicleDetailField(item, vehicle)
                    )}
                </Grid>
            </Box>
        )
    }, [extractedVehicleName, row.vehicle, handleCopyText, renderVehicleDetailField])

    const renderLoadingState = useCallback(() => (
        <AppLoader />
    ), [])

    const renderErrorState = useCallback(() => (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1B2064' }}>
                {extractedVehicleName || row.vehicle}
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
                {fetchError?.message || "Vehicle details not found"}
            </Alert>
        </Box>
    ), [extractedVehicleName, row.vehicle, fetchError])

    const renderNoVehicleState = useCallback(() => (
        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            No vehicle information available
        </Typography>
    ), [])

    const renderFallbackState = useCallback(() => (
        <Box>
            <Typography variant="h2" gutterBottom sx={{
                fontWeight: 'bold',
                color: '#1B2064',
                fontSize: '1.5rem'
            }}>
                {row.vehicle}
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
                No detailed information available for this vehicle
            </Alert>
        </Box>
    ), [row.vehicle])

    const renderVehicleDetails = useCallback(() => {
        if (isProcessing) {
            return renderLoadingState()
        }

        if (fetchError) {
            return renderErrorState()
        }

        if (!row?.vehicle) {
            return renderNoVehicleState()
        }

        if (vehicleData?.data) {
            return renderDatabaseVehicleDetails(vehicleData.data)
        }

        return renderFallbackState()
    }, [
        isProcessing,
        fetchError,
        row?.vehicle,
        vehicleData?.data,
        renderLoadingState,
        renderErrorState,
        renderNoVehicleState,
        renderDatabaseVehicleDetails,
        renderFallbackState
    ])

    const cardHeaderSx = useMemo(() => ({
        fontWeight: 700,
        mb: 1,
        color: "primary.main",
        fontSize: "0.9rem",
        flexShrink: 0,
        textDecoration: "underline",
        textTransform: "uppercase",
        textUnderlineOffset: "3px",
        letterSpacing: "0.5px",
    }), [])

    const cardSx = useMemo(() => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        overflow: 'hidden',
        p: 1.5
    }), [])

    return (
        <Grid item xs={12} md={4} sx={{ maxWidth: '100%' }}>
            <AppCard sx={cardSx}>
                <Typography variant="subtitle1" sx={cardHeaderSx}>
                    Vehicle Details
                </Typography>

                <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0, maxWidth: '100%' }}>
                    {renderVehicleDetails()}
                </Box>
            </AppCard>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    )
}

export default VehicleDetailsSection