'use client'

import React, { useState, useCallback } from "react"
import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Snackbar,
    Alert
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import AppCard from '../../../../../../@crema/components/AppCard/index'
import VehicleDetailsSection from "./VehicleDetailsSection"

const ExpandedRowDetails = ({ row, onCopy }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
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

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false)
    }, [])

    const infoItems = [
        { label: "Cx_Name", value: row.customerName || row.easy_tow?.customerName || "-" },
        { label: "PO Number", value: row.po || row.easy_tow?.purchaseOrder || "-" },
        {
            label: "Date",
            value: row.easy_tow?.createdAt
                ? new Date(row.easy_tow.createdAt).toLocaleDateString()
                : "-",
        },
        { label: "Reason", value: row.reason || "-" },
        { label: "Cx_Number", value: row.customerPhone || "-" },
    ]

    const Label = ({ children }) => (
        <Typography
            variant="body2"
            sx={{
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "text.secondary",
                letterSpacing: 0.2,
            }}
        >
            {children}
        </Typography>
    )

    const Value = ({ children, sx }) => (
        <Typography
            variant="body1"
            sx={{
                fontWeight: 500,
                fontSize: "0.875rem",
                color: "text.primary",
                ...sx
            }}
        >
            {children}
        </Typography>
    )

    const renderInfoItem = (item, index) => (
        <Grid item xs={12} key={index} sx={{ width: '100%', paddingLeft: '0 !important' }}>
            <Box sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.5,
                width: '100%',
                overflow: 'hidden'
            }}>
                <Label sx={{ flexShrink: 0, minWidth: 'fit-content' }}>
                    {item.label}:
                </Label>
                <Value sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    flex: 1,
                    minWidth: 0
                }}>
                    {item.value}
                </Value>
                {item.value && item.value !== "-" && (
                    <Tooltip title={`Copy ${item.label}`} arrow>
                        <IconButton
                            size="small"
                            sx={{ p: 0.3, flexShrink: 0, mt: -0.3 }}
                            onClick={() => handleCopyText(item.value, item.label)}
                        >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Grid>
    )

    const renderLocationField = (label, value, copyLabel) => (
        <Box sx={{ mb: 1.5, maxWidth: '100%', overflow: 'hidden' }}>
            <Label>{label}</Label>
            <Box sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.5,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <Value sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    flex: 1,
                    minWidth: 0
                }}>
                    {value || "-"}
                </Value>
                {value && value !== "-" && (
                    <Tooltip title={`Copy ${copyLabel}`} arrow>
                        <IconButton
                            size="small"
                            sx={{ p: 0.3, flexShrink: 0, mt: -0.3 }}
                            onClick={() => handleCopyText(value, copyLabel)}
                        >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    )

    const renderNotesField = () => (
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Label>Additional Notes</Label>
            <Box sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.5,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <Value sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    flex: 1,
                    minWidth: 0,
                    lineHeight: 1.5
                }}>
                    {row.notes || "No notes available"}
                </Value>
                {row.notes && row.notes !== "-" && (
                    <Tooltip title="Copy Notes" arrow>
                        <IconButton
                            size="small"
                            sx={{ p: 0.3, flexShrink: 0, mt: -0.3 }}
                            onClick={() => handleCopyText(row.notes, "Notes")}
                        >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    )

    const cardHeaderSx = {
        fontWeight: 700,
        mb: 1,
        color: "primary.main",
        fontSize: "0.9rem",
        flexShrink: 0,
        textDecoration: "underline",
        textTransform: "uppercase",
        textUnderlineOffset: "3px",
        letterSpacing: "0.5px",
    }

    const cardSx = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        overflow: 'hidden',
        p: 1.5
    }

    return (
        <Box sx={{
            p: 1.5,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <Grid
                container
                spacing={1.5}
                sx={{
                    width: '100%',
                    margin: 0,
                    '& > .MuiGrid-item': {
                        paddingLeft: '12px',
                        paddingTop: '12px'
                    }
                }}
            >
                {/* Job Info */}
                <Grid item xs={12} md={4} sx={{ maxWidth: '100%', paddingLeft: '0 !important' }}>
                    <AppCard sx={cardSx}>
                        <Typography variant="subtitle1" sx={cardHeaderSx}>
                            Job Info
                        </Typography>

                        <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0, maxWidth: '100%' }}>
                            <Box sx={{ maxWidth: '100%', overflow: 'hidden', mt: 0 }}>
                                <Grid
                                    container
                                    spacing={0.75}
                                    sx={{
                                        width: '100%',
                                        margin: 0,
                                        '& > .MuiGrid-item': {
                                            paddingLeft: '0',
                                            paddingTop: '6px'
                                        }
                                    }}
                                >
                                    {infoItems.map(renderInfoItem)}
                                </Grid>
                            </Box>

                            {renderLocationField("Pickup", row.source, "Pickup")}
                            {renderLocationField("Drop-off", row.destination, "Drop-off")}
                        </Box>
                    </AppCard>
                </Grid>

                {/* Notes */}
                <Grid item xs={12} md={4} sx={{ maxWidth: '100%' }}>
                    <AppCard sx={cardSx}>
                        <Typography variant="subtitle1" sx={cardHeaderSx}>
                            Notes
                        </Typography>

                        <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0, maxWidth: '100%' }}>
                            {renderNotesField()}
                        </Box>
                    </AppCard>
                </Grid>

                {/* Vehicle Details */}
                <VehicleDetailsSection row={row} onCopy={handleCopyText} />
            </Grid>

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
        </Box>
    )
}

export default ExpandedRowDetails