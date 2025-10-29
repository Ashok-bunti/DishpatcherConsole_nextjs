'use client'

import React, { useState } from "react"
import { useAppDispatch } from '../../../../../store/hooks/index'
import { useCloseCall, useAIDashboard } from '../../../../../services/towReportService'
import { showSnackbar } from '../../../../../store/slices/uiSlice'
import { Button, Snackbar, Alert } from "@mui/material"
import { CallEnd as CallEndIcon } from '@mui/icons-material'
import CloseCallPopup from "../CloseCallPopup"

const CloseJobButton = ({ row, onCloseSuccess, disabled = false, title = "Close this job" }) => {
    const dispatch = useAppDispatch()
    const [closeCallPopupOpen, setCloseCallPopupOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const { mutate: closeCall } = useCloseCall()
    const { refetch: refreshDashboard } = useAIDashboard({
        account: row?.account || "AJS",
        skip: 0,
        top: 100,
    })

    const handleCloseCall = async (closeData) => {
        if (!row?.id) return

        setIsProcessing(true)
        
        try {
            closeCall(
                { 
                    id: row.id, 
                    closeData: {
                        ...row,
                        tx_job_status: closeData?.tx_job_status,
                        closeData
                    }
                },
                {
                    onSuccess: () => {
                        dispatch(showSnackbar({
                            message: 'Call completed successfully',
                            severity: 'success'
                        }))
                        setCloseCallPopupOpen(false)

                        // Refresh dashboard
                        refreshDashboard()

                        if (onCloseSuccess) {
                            onCloseSuccess()
                        }
                    },
                    onError: (error) => {
                        dispatch(showSnackbar({
                            message: 'Error closing call',
                            severity: 'error'
                        }))
                    },
                    onSettled: () => {
                        setIsProcessing(false)
                    }
                }
            )
        } catch (error) {
            console.error('Error updating status:', error)
            dispatch(showSnackbar({
                message: 'Error closing call',
                severity: 'error'
            }))
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => setCloseCallPopupOpen(true)}
                startIcon={<CallEndIcon />}
                disabled={isProcessing || disabled}
                sx={{
                    fontSize: '0.7rem',
                    px: 1.5,
                    py: 0.6,
                    minWidth: '70px',
                    height: '28px',
                    mr: 1,
                    boxShadow: 'none'
                }}
                title={title}
            >
                Close
            </Button>

            <CloseCallPopup
                open={closeCallPopupOpen}
                onClose={() => setCloseCallPopupOpen(false)}
                selectedReport={row}
                onConfirmClose={handleCloseCall}
            />
        </>
    )
}

export default CloseJobButton