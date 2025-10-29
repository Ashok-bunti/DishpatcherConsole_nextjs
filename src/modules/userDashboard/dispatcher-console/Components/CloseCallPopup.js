'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material'

const CloseCallPopup = ({ open, onClose, selectedReport, onConfirmClose }) => {
    const [closeData, setCloseData] = useState({
        tx_job_status: 'completed',
        close_notes: '',
        completion_reason: ''
    })

    const handleChange = (field, value) => {
        setCloseData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        onConfirmClose(closeData)
        setCloseData({
            tx_job_status: 'completed',
            close_notes: '',
            completion_reason: ''
        })
    }

    const handleCancel = () => {
        setCloseData({
            tx_job_status: 'completed',
            close_notes: '',
            completion_reason: ''
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Close Job - {selectedReport?.po || 'Unknown PO'}
                </Typography>
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={closeData.tx_job_status}
                            label="Status"
                            onChange={(e) => handleChange('tx_job_status', e.target.value)}
                        >
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="no_service">No Service Required</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Completion Reason</InputLabel>
                        <Select
                            value={closeData.completion_reason}
                            label="Completion Reason"
                            onChange={(e) => handleChange('completion_reason', e.target.value)}
                        >
                            <MenuItem value="service_completed">Service Completed</MenuItem>
                            <MenuItem value="customer_cancelled">Customer Cancelled</MenuItem>
                            <MenuItem value="no_show">No Show</MenuItem>
                            <MenuItem value="vehicle_not_found">Vehicle Not Found</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Close Notes"
                        multiline
                        rows={3}
                        value={closeData.close_notes}
                        onChange={(e) => handleChange('close_notes', e.target.value)}
                        placeholder="Add any additional notes about job completion..."
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleCancel} color="inherit">
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    disabled={!closeData.completion_reason}
                >
                    Confirm Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CloseCallPopup