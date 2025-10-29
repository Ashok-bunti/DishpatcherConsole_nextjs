'use client'

import React from 'react'
import {
    Popover,
    Box,
    Typography,
    Grid,
    Chip,
    Divider
} from '@mui/material'

const StatusCountCard = ({ open, anchorEl, onClose, towReports, selectedAccount }) => {
    const calculateStats = () => {
        if (!towReports || !Array.isArray(towReports)) {
            return {
                total: 0,
                completed: 0,
                pending: 0,
                inProgress: 0,
                aiCalls: 0,
                nonAiCalls: 0
            }
        }

        const filteredReports = selectedAccount === 'all' 
            ? towReports 
            : towReports.filter(report => report.account === selectedAccount)

        return {
            total: filteredReports.length,
            completed: filteredReports.filter(report => report.tx_job_status === 'completed').length,
            pending: filteredReports.filter(report => !report.processed_by).length,
            inProgress: filteredReports.filter(report => report.processed_by && report.tx_job_status !== 'completed').length,
            aiCalls: filteredReports.filter(report => 
                report.account === selectedAccount &&
                report.ai_call_disabled === false &&
                report.tx_job_status !== "completed" &&
                report.cx_call !== "ai_call_failed" &&
                report.easy_tow?.responseText?.CallScoreReview !== "Negative" &&
                report.easy_tow?.responseText?.CallScoreReview !== "Neutral"
            ).length,
            nonAiCalls: filteredReports.filter(report =>
                (report.ai_call_disabled === true && report.tx_job_status !== "completed") ||
                (report.escalated === true &&
                    report.tx_job_status !== "completed" &&
                    ["ai_call_failed", "ended"].includes(report.cx_call) &&
                    (report.easy_tow?.responseText?.CallScoreReview === "Negative" ||
                        report.easy_tow?.responseText?.CallScoreReview === "Neutral"))
            ).length
        }
    }

    const stats = calculateStats()

    const StatItem = ({ label, value, color = 'primary' }) => (
        <Box sx={{ textAlign: 'center', p: 1 }}>
            <Chip 
                label={value} 
                color={color}
                variant="outlined"
                sx={{ mb: 1, fontWeight: 'bold' }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
                {label}
            </Typography>
        </Box>
    )

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{
                sx: {
                    width: 320,
                    maxHeight: 400,
                    p: 2
                }
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Job Statistics
                {selectedAccount !== 'all' && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        Account: {selectedAccount}
                    </Typography>
                )}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <StatItem label="Total Jobs" value={stats.total} color="primary" />
                </Grid>
                <Grid item xs={6}>
                    <StatItem label="Completed" value={stats.completed} color="success" />
                </Grid>
                <Grid item xs={6}>
                    <StatItem label="Pending" value={stats.pending} color="warning" />
                </Grid>
                <Grid item xs={6}>
                    <StatItem label="In Progress" value={stats.inProgress} color="info" />
                </Grid>
                <Grid item xs={6}>
                    <StatItem label="AI Calls" value={stats.aiCalls} color="secondary" />
                </Grid>
                <Grid item xs={6}>
                    <StatItem label="Non-AI Calls" value={stats.nonAiCalls} color="error" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date().toLocaleTimeString()}
                </Typography>
            </Box>
        </Popover>
    )
}

export default StatusCountCard