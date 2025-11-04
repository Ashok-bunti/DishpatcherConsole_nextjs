'use client'

import React, { useState } from "react"
import { useAppSelector } from '../../../../../store/hooks/index'
import { Box, Snackbar, Alert, Button } from "@mui/material"
import AICallButton from "../../Components/stubs/AICallButton"
import AICallReview from "../../Components/stubs/AICallReview"
import AcceptButton from "../../Components/stubs/AcceptButton"
import ReleaseButton from "../../Components/stubs/ReleaseButton"
import CloseJobButton from "./CloseJobButton"
import MockDriverLocationProvider from "./MockDriverLocationProvider"
import { useAuthUser } from '../../../../../@crema/hooks/AuthHooks'

const ActionButtons = ({ row, onActionSuccess }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')
    const [optimisticData, setOptimisticData] = useState(null)
    const { user } = useAuthUser()

    const displayRow = optimisticData || row

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
    }

    const handleActionSuccess = (actionType, updatedData = {}) => {
        if (Object.keys(updatedData).length > 0) {
            setOptimisticData({ ...row, ...updatedData })
            setTimeout(() => {
                setOptimisticData(null)
            }, 5000)
        }

        if (onActionSuccess) {
            onActionSuccess()
        }

        if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('refreshJobsData', {
                detail: { action: actionType, rowId: row?.id }
            }))
        }

        showSnackbar(`${actionType} action completed successfully`)
    }

    const isCompleted = displayRow?.tx_job_status === "completed"
    const hasProcessedBy = !!displayRow?.processed_by

    const hasCompletedAICall = () => {
        if (displayRow?.easy_tow?.responseText) {
            return true
        }

        const completedStatuses = ['completed', 'ended', 'answered', 'ai_call_completed']
        if (displayRow?.cx_call && completedStatuses.includes(displayRow.cx_call)) {
            return true
        }

        if (displayRow?.easy_tow?.responseText?.CallScoreReview) {
            return true
        }

        return false
    }

    const hasAICallData = hasCompletedAICall()

    const getPersonInitials = () => {
        if (!displayRow?.processed_by) return "-"

        const name = displayRow.processed_by?.displayName ||
            displayRow.processed_by?.name ||
            displayRow.processed_by?.username ||
            ""

        if (!name || name.trim() === "") return "-"

        const initials = name.trim().substring(0, 2).toUpperCase()
        return initials || "-"
    }

    const isAcceptedByCurrentUser = () => {
        if (!hasProcessedBy || !user) return false

        const processedBy = displayRow?.processed_by

        return (
            processedBy?.email === user?.email ||
            processedBy?.id === user?.id ||
            processedBy?._id === user?.id
        )
    }

    const showAcceptButton = !hasProcessedBy
    const showReleaseButton = hasProcessedBy && isAcceptedByCurrentUser()
    const isButton1Disabled = isCompleted

    const isCloseDisabled = isCompleted

    const showAICallButton = hasProcessedBy && !hasAICallData
    const showAIReviewButton = hasAICallData
    const isButton3Disabled = isCompleted || !hasProcessedBy

    const handleAcceptSuccess = (optimisticProcessedBy) => {
        const processedByData = optimisticProcessedBy || {
            _id: user?.id,
            id: user?.id,
            email: user?.email,
            name: user?.displayName || user?.name || user?.email,
            displayName: user?.displayName || user?.name || user?.email
        }

        handleActionSuccess("Accept", {
            processed_by: processedByData
        })
    }

    const handleReleaseSuccess = () => {
        handleActionSuccess("Release", { processed_by: null })
    }

    const handleCloseSuccess = () => {
        handleActionSuccess("Close", { tx_job_status: "completed" })
    }

    const handleAICallSuccess = () => {
        handleActionSuccess("AI Call")
    }

    const PlaceholderButton = ({ text, tooltip }) => (
        <Box
            sx={{
                fontSize: '0.65rem',
                px: 1.5,
                py: 0.6,
                minWidth: '70px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '4px',
                color: 'rgba(0, 0, 0, 0.4)',
                border: '1px dashed rgba(0, 0, 0, 0.15)',
                fontWeight: 500,
            }}
            title={tooltip}
        >
            {text}
        </Box>
    )

    return (
        <>
            <MockDriverLocationProvider row={displayRow}>
                <Box
                    sx={{
                        display: "grid",
                        alignItems: "center",
                        gridTemplateColumns: "70px 70px 70px 0px",
                        gap: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        disabled
                        sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.6,
                            minWidth: '70px',
                            height: '28px',
                            backgroundColor: hasProcessedBy ? '#9E9E9E' : '#fafafa',
                            color: hasProcessedBy ? 'white' : '#9e9e9e',
                            '&.Mui-disabled': {
                                backgroundColor: hasProcessedBy ? '#9E9E9E' : '#fafafa',
                                color: hasProcessedBy ? 'white' : '#9e9e9e',
                                border: `1px dotted ${hasProcessedBy ? '#9E9E9E' : '#9e9e9e'}`,
                            },
                        }}
                        title={
                            hasProcessedBy
                                ? `Assigned to: ${displayRow.processed_by?.displayName || displayRow.processed_by?.name || 'Unknown'}`
                                : 'Not assigned'
                        }
                    >
                        {getPersonInitials()}
                    </Button>

                    {/* Button 1: Accept OR Release OR Ended */}
                    {displayRow?.cx_call === "ended" || displayRow?.tx_job_status === "completed" ? (
                        <Box>
                            <Button
                                variant="outlined"
                                size="small"
                                disabled
                                sx={{
                                    fontSize: '0.7rem',
                                    px: 1.5,
                                    py: 0.6,
                                    width: '70px',
                                    height: '28px',
                                    opacity: 0.6,
                                    cursor: 'not-allowed',
                                    '&.Mui-disabled': {
                                        opacity: 0.6,
                                    }
                                }}
                                title="Call ended - No action available"
                            >
                                Ended
                            </Button>
                        </Box>
                    ) : showAcceptButton ? (
                        <Box>
                            <AcceptButton
                                row={displayRow}
                                selectedReport={displayRow}
                                size="small"
                                disabled={isButton1Disabled}
                                onSuccess={handleAcceptSuccess}
                                sx={{
                                    fontSize: '0.7rem',
                                    px: 1.5,
                                    py: 0.6,
                                    minWidth: '70px',
                                    opacity: isButton1Disabled ? 0.5 : 1,
                                    cursor: isButton1Disabled ? 'not-allowed' : 'pointer',
                                    '&.Mui-disabled': {
                                        opacity: 0.5,
                                    }
                                }}
                                title={isButton1Disabled ? "Job is completed" : "Accept this job"}
                            />
                        </Box>
                    ) : showReleaseButton ? (
                        <Box>
                            <ReleaseButton
                                row={displayRow}
                                selectedReport={displayRow}
                                size="small"
                                disabled={isButton1Disabled}
                                onSuccess={handleReleaseSuccess}
                                sx={{
                                    fontSize: '0.7rem',
                                    px: 1.5,
                                    py: 0.6,
                                    width: '70px',
                                    height: '28px',
                                    boxShadow: 'none',
                                    opacity: isButton1Disabled ? 0.5 : 1,
                                    cursor: isButton1Disabled ? 'not-allowed' : 'pointer',
                                    '&.Mui-disabled': {
                                        opacity: 0.5,
                                    }
                                }}
                                title={isButton1Disabled ? "Job is completed" : "Release this job"}
                            />
                        </Box>
                    ) : hasProcessedBy ? (
                        <Box>
                            <Button
                                variant="contained"
                                color="info"
                                disabled
                                sx={{
                                    fontSize: '0.7rem',
                                    px: 1.5,
                                    py: 0.6,
                                    minWidth: 'auto',
                                    backgroundColor: '#B0B0B0',
                                }}
                            >
                                {displayRow.processed_by?.name ? displayRow.processed_by.name.substring(0, 5) : 'Accepted'}
                            </Button>
                        </Box>
                    ) : null}

                    {/* Button 2: Close (always show, enabled/disabled) */}
                    {isCloseDisabled ? (
                        <PlaceholderButton
                            text="Closed"
                            tooltip="Job is already completed"
                        />
                    ) : (
                        <CloseJobButton
                            row={displayRow}
                            onCloseSuccess={handleCloseSuccess}
                            disabled={isCloseDisabled}
                            title="Close this job"
                        />
                    )}

                    {/* Button 3: AI Call OR AI Review (mutually exclusive) */}
                    {showAICallButton ? (
                        <AICallButton
                            row={displayRow}
                            selectedReport={displayRow}
                            size="small"
                            disabled={isButton3Disabled}
                            onSuccess={handleAICallSuccess}
                            sx={{
                                fontSize: '0.7rem',
                                px: 1.5,
                                py: 0.6,
                                minWidth: '70px',
                                height: '28px',
                                opacity: isButton3Disabled ? 0.5 : 1,
                                cursor: isButton3Disabled ? 'not-allowed' : 'pointer',
                                '&.Mui-disabled': {
                                    opacity: 0.5,
                                }
                            }}
                            title={
                                isCompleted
                                    ? "Job is completed"
                                    : !hasProcessedBy
                                        ? "Job must be assigned first"
                                        : "Make AI call"
                            }
                        />
                    ) : showAIReviewButton ? (
                        <AICallReview
                            selectedReport={displayRow}
                            size="small"
                            disabled={false}
                            sx={{
                                fontSize: '0.7rem',
                                px: 1.5,
                                py: 0.6,
                                minWidth: '70px',
                                height: '28px',
                            }}
                            title="Review AI call details"
                        />
                    ) : (
                        <PlaceholderButton
                            text="Review"
                            tooltip="No AI call data available"
                        />
                    )}
                </Box>
            </MockDriverLocationProvider>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ActionButtons