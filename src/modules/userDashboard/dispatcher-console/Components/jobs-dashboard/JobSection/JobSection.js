'use client'

import React, { useState, useMemo } from "react"
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Pagination,
    alpha,
    Snackbar,
    Alert,
    IconButton,
    Button,
    TableContainer,
    Divider
} from "@mui/material"
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material'
import ActionButtons from "../ActionButtons"
import { StyledTableCell } from "./StyledComponents"
import ExpandedRowDetails from "./ExpandedRowDetails"
import AppCard from '../../../../../../@crema/components/AppCard/index'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const JobSection = ({
    label,
    color,
    apiData,
    filterType,
    loggedInUserId,
    onDataUpdate,
    loading = false,
    pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, pageSize: 4 },
    onPageChange,
    onRowsPerPageChange,
    sectionCount,
    timeData
}) => {
    const [expandedRowId, setExpandedRowId] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')

    const timeSinceLastJob = useMemo(() => {
        if (!apiData || apiData.length === 0) {
            return null
        }

        const sortedData = [...apiData].sort((a, b) => {
            const dateA = new Date(a.created)
            const dateB = new Date(b.created)
            return dateB - dateA
        })

        const lastJob = sortedData[0]

        if (!lastJob?.created) {
            return null
        }

        const lastJobDate = new Date(lastJob.created)
        const now = new Date()
        const diffMs = Math.max(0, now.getTime() - lastJobDate.getTime())

        if (diffMs <= 0) {
            return 'Just now'
        }

        const diffSeconds = Math.floor(diffMs / 1000)
        const diffMinutes = Math.floor(diffSeconds / 60)
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)

        let result
        if (diffDays > 0) {
            result = `${diffDays}d ${diffHours % 24}h ago`
        } else if (diffHours > 0) {
            result = `${diffHours}h ${diffMinutes % 60}m ago`
        } else if (diffMinutes > 0) {
            result = `${diffMinutes}m ago`
        } else if (diffSeconds > 30) {
            result = `${diffSeconds}s ago`
        } else {
            result = 'Just now'
        }
        return result
    }, [apiData, timeData])

    const formatJobDate = (dateString, timezone) => {
        if (!dateString) return "-"

        const date = new Date(dateString)

        if (timezone) {
            return date.toLocaleString("en-US", {
                timeZone: timezone,
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        }

        return date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const handleChange = (event, value) => {
        if (onPageChange) {
            onPageChange(value)
        }
    }

    const handleActionSuccess = () => {
        if (onDataUpdate) onDataUpdate()
    }

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
    }

    const handleCopySuccess = (message = 'Copied to clipboard!', severity = 'success') => {
        showSnackbar(message, severity)
    }

    const handleExpandClick = (rowId) => {
        setExpandedRowId(prev => (prev === rowId ? null : rowId))
    }

    return (
        <Box >
            {(!apiData || apiData.length === 0) ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Typography variant="body1">No {label.toLowerCase()} found</Typography>
                </Box>
            ) : (
                <AppCard sx={{
                    border: 'none !important',
                    outline: 'none !important',
                    boxShadow: 'none !important',
                    "& .MuiCard-root": {
                        border: 'none !important',
                        outline: 'none !important',
                        boxShadow: 'none !important'
                    },
                    "& .MuiPaper-root": {
                        border: 'none !important',
                        outline: 'none !important',
                        boxShadow: 'none !important'
                    }
                }}>
                    {/* Header Section with Color Dots and Last Job Time */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            mb: 0,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                                {[...Array(3)].map((_, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: color,
                                            borderRadius: '2px',
                                        }}
                                    />
                                ))}
                            </Box>

                            <Typography
                                variant="h5"
                                sx={{ 
                                    fontWeight: 600, 
                                    color: '#333', 
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.3px'
                                }}
                            >
                                {label}
                            </Typography>
                        </Box>

                        {timeSinceLastJob && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.82rem",
                                        color: "#1B2064",
                                        fontWeight: 600,
                                        letterSpacing: 0.2,
                                    }}
                                >
                                    Last job:
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: "#F9FAFB",
                                        px: 2,
                                        py: 0.6,
                                        borderRadius: "10px",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                        width: "fit-content",
                                        border: "1px solid #F0F0F0"
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 16, color: "#1B2064" }} />

                                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "#E0E0E0", height: 16 }} />

                                    <Typography
                                        sx={{
                                            fontSize: "0.8rem",
                                            color: "#555",
                                            fontWeight: 500,
                                            letterSpacing: '0.2px'
                                        }}
                                    >
                                        {timeSinceLastJob}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Table Container */}
                    <TableContainer
                        component={Paper}
                        sx={{
                            width: "100%",
                            overflowX: "auto",
                            maxWidth: "100vw",
                            border: 'none !important',
                            outline: 'none !important',
                            boxShadow: 'none !important',
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Table sx={{
                            minWidth: 1200,
                            whiteSpace: "nowrap",
                            border: 'none !important',
                            outline: 'none !important',
                            tableLayout: 'fixed',
                            backgroundColor: 'white'
                        }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1B2064' }}>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '100px',
                                        letterSpacing: '0.5px'
                                    }}>PO</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '100px',
                                        letterSpacing: '0.5px'
                                    }}>Date</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '60px',
                                        letterSpacing: '0.5px'
                                    }}>Cx Number</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '80px',
                                        letterSpacing: '0.5px'
                                    }}>Cx Name</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '130px',
                                        letterSpacing: '0.5px'
                                    }}>Vehicle</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '80px',
                                        letterSpacing: '0.5px'
                                    }}>Reason</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '80px',
                                        letterSpacing: '0.5px'
                                    }}>Notes</StyledTableCell>
                                    <StyledTableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: "11px", sm: "14px" },
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        py: 1.5,
                                        width: '180px',
                                        letterSpacing: '0.5px'
                                    }}>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {apiData.map((row, idx) => (
                                    <React.Fragment key={row.id || idx}>
                                        <TableRow
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: alpha("#1B2064", 0.05),
                                                    "& .MuiButton-root": {
                                                        pointerEvents: "auto",
                                                        transition: "none !important",
                                                        "&:hover": {
                                                            transition: "none !important"
                                                        }
                                                    }
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                fontWeight: 600,
                                                color: '#1B2064',
                                                textDecoration: "underline",
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                '&:hover': {
                                                    color: '#0d1442',
                                                    textDecoration: 'underline',
                                                    backgroundColor: alpha("#1B2064", 0.02)
                                                }
                                            }}
                                                onClick={() => handleExpandClick(row.id || idx)}
                                            >
                                                #{row.po || row.easy_tow?.purchaseOrder || "-"}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                sx={{
                                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                    py: 0.9,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    color: '#555'
                                                }}
                                            >
                                                {formatJobDate(row?.created, timeData?.[0]?.timezone)}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#555'
                                            }}>
                                                {row.customer_contact
                                                    ? row.customer_contact.replace(/\D/g, "") || "-"
                                                    : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#555'
                                            }}>
                                                {row.customer_contact?.split("(")[0]?.trim() || "-"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#555'
                                            }}>
                                                {row.vehicle || "-"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#555'
                                            }}>
                                                {row.reason || "-"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#555'
                                            }}>
                                                {row?.driver_notes || "-"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{
                                                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                                py: 0.9,
                                                overflow: 'visible'
                                            }}>
                                                <ActionButtons row={row} onActionSuccess={handleActionSuccess} />
                                            </StyledTableCell>
                                        </TableRow>

                                        {expandedRowId === (row.id || idx) && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    sx={{
                                                        backgroundColor: "#E0E3E7",
                                                        p: 0,
                                                        overflow: 'hidden',
                                                        maxWidth: '100%',
                                                        borderBottom: '2px solid #D0D3D7'
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: '100%',
                                                        maxWidth: '100%',
                                                        overflow: 'hidden',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <ExpandedRowDetails
                                                            row={row}
                                                            onCopy={(msg) => handleCopySuccess(msg)}
                                                        />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination and Info Section */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                        p: 1
                    }}>
                        {/* Section Info - Left */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography sx={{
                                fontSize: '0.813rem',
                                color: '#777',
                                fontWeight: 400,
                                letterSpacing: '0.3px'
                            }}>
                                {pagination ? (
                                    <>
                                        Page <strong style={{ color: '#333', fontWeight: 600 }}>{pagination.currentPage}</strong> of{' '}
                                        <strong style={{ color: '#333', fontWeight: 600 }}>{pagination.totalPages}</strong>
                                        {' '}• Total: <strong style={{ color: '#333', fontWeight: 600 }}>{pagination.totalRecords}</strong> records
                                    </>
                                ) : (
                                    <>
                                        Showing <strong style={{ color: '#333', fontWeight: 600 }}>{apiData?.length || 0}</strong> of{' '}
                                        <strong style={{ color: '#333', fontWeight: 600 }}>{sectionCount || 0}</strong> records
                                    </>
                                )}
                            </Typography>

                            {/* Rows per page selector */}
                            {pagination && onRowsPerPageChange && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '0.813rem', color: '#777' }}>
                                        Rows:
                                    </Typography>
                                    <select
                                        value={pagination.pageSize}
                                        onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
                                        style={{
                                            padding: '4px 8px',
                                            border: '1px solid #d0d0d0',
                                            borderRadius: '4px',
                                            fontSize: '0.813rem',
                                            color: '#333',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value={4}>4</option>
                                        <option value={8}>8</option>
                                        <option value={12}>12</option>
                                        <option value={20}>20</option>
                                    </select>
                                </Box>
                            )}
                        </Box>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.currentPage}
                                onChange={handleChange}
                                color="primary"
                                size="medium"
                                showFirstButton
                                showLastButton
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#666',
                                        borderColor: '#d0d0d0',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        minWidth: '32px',
                                        height: '32px',
                                        '&.Mui-selected': {
                                            backgroundColor: color,
                                            color: 'white',
                                            borderColor: color,
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: color,
                                                opacity: 0.9
                                            }
                                        },
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            borderColor: '#b0b0b0'
                                        }
                                    }
                                }}
                            />
                        )}
                    </Box>
                </AppCard>
            )}
            
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity} 
                    sx={{ 
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default JobSection