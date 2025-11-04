'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Divider,
    Alert,
    RadioGroup,
    Radio,
    MenuItem,
    InputLabel,
    FormControl,
    Select
} from '@mui/material'

const CloseCallPopup = ({ open, onClose, selectedReport, onConfirmClose }) => {
    const [notes, setNotes] = useState('')
    const [checklist, setChecklist] = useState({
        cxCalled: '',
        aiCallReviewed: false,
        notesCopied: false,
        errorType: '',
        manualError: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errorTypes = [
        'CX already called',
        'Expired Job',
        'Inbound COD job'
    ]

    const handleClose = () => {
        setNotes('')
        setChecklist({
            cxCalled: '',
            aiCallReviewed: false,
            notesCopied: false,
            errorType: '',
            manualError: ''
        })
        onClose()
    }

    const handleCxCalledChange = (event) => {
        setChecklist(prev => ({
            ...prev,
            cxCalled: event.target.value
        }))
    }

    const handleErrorTypeChange = (event) => {
        setChecklist(prev => ({
            ...prev,
            errorType: event.target.value,
            manualError: event.target.value === 'Other' ? '' : prev.manualError
        }))
    }

    const handleManualErrorChange = (event) => {
        setChecklist(prev => ({
            ...prev,
            manualError: event.target.value
        }))
    }

    const handleChecklistChange = (field) => (event) => {
        setChecklist(prev => ({
            ...prev,
            [field]: event.target.checked
        }))
    }

    const isAllChecklistCompleted = () => {
        // Original requirements
        const originalCompleted = checklist.cxCalled !== '' &&
            Object.entries(checklist)
                .filter(([key]) => key !== 'cxCalled' && key !== 'errorType' && key !== 'manualError')
                .every(([_, value]) => value === true)

        // New error-related fields
        const errorCompleted = checklist.errorType !== '' &&
            (checklist.errorType !== 'Other' || checklist.manualError !== '')

        return originalCompleted || errorCompleted
    }

    const handleConfirmClose = async () => {
        if (!isAllChecklistCompleted()) return

        setIsSubmitting(true)
        try {
            await onConfirmClose({
                tx_job_status: 'completed',
                ...(checklist.errorType && { error_type: checklist.errorType }),
                ...(checklist.manualError && { manual_error: checklist.manualError })
            })
            handleClose()
        } catch (error) {
            console.error('Error closing call:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3,
                    height: 'auto',
                    width: '500px',
                }
            }}
        >
            <DialogContent sx={{ pt: 5, pb: 5, px: 5 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" sx={{
                        mb: 3,
                        color: '#1B2064',
                        fontWeight: 'bold'
                    }}>
                        Job Completion Checklist
                    </Typography>
                    <Box sx={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: 2,
                        p: 2,
                        mb: 3
                    }}>

                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle1" sx={{ minWidth: 'fit-content' }}>
                                Cx Called :
                            </Typography>
                            <RadioGroup row value={checklist.cxCalled} onChange={handleCxCalledChange} name="cxCalledOptions">
                                <FormControlLabel value="AI" control={<Radio sx={{ color: '#1B2064' }} />} label="AI" />
                                <FormControlLabel value="Manual" control={<Radio sx={{ color: '#1B2064' }} />} label="Manual" />
                                <FormControlLabel value="Both" control={<Radio sx={{ color: '#1B2064' }} />} label="Both" />
                            </RadioGroup>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checklist.aiCallReviewed}
                                        onChange={handleChecklistChange('aiCallReviewed')}
                                        sx={{ color: '#1B2064' }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        AI Call reviewed
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checklist.notesCopied}
                                        onChange={handleChecklistChange('notesCopied')}
                                        sx={{ color: '#1B2064' }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Notes copied to Towbook
                                    </Typography>
                                }
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Typography variant="h6" color='error' sx={{ mb: 2, fontWeight: 'bold' }}>
                            Error Reporting
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="error-type-label"
                                sx={{
                                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            >Select Error Type</InputLabel>
                            <Select
                                labelId="error-type-label"
                                value={checklist.errorType}
                                onChange={handleErrorTypeChange}
                                label="Select Error Type"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {errorTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        {checklist.errorType === 'Other' && (
                            <TextField
                                fullWidth
                                label="Enter Error Description"
                                value={checklist.manualError}
                                onChange={handleManualErrorChange}
                                multiline
                                rows={2}
                                variant="outlined"
                                required
                            />
                        )}
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {!isAllChecklistCompleted() && (
                        <Alert severity="warning" color='error' sx={{ mt: 2 }}>
                            Please complete all checklist items or report an error to enable the Done button.
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="error"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmClose}
                    variant="contained"
                    disabled={!isAllChecklistCompleted() || isSubmitting}
                    sx={{
                        backgroundColor: isAllChecklistCompleted() ? '#4caf50' : '#ccc',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: isAllChecklistCompleted() ? '#45a049' : '#ccc'
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666'
                        }
                    }}
                >
                    {isSubmitting ? 'Processing...' : 'Done'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CloseCallPopup