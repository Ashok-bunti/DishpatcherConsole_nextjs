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

const JobsCountCard = ({ open, anchorEl, onClose, tabCounts }) => {
    const jobCategories = [
        {
            id: 'all',
            label: 'All Jobs',
            color: 'primary',
            count: tabCounts.all || 0,
            description: 'Total active jobs'
        },
        {
            id: 'ai',
            label: 'AI Calls',
            color: 'secondary',
            count: tabCounts.ai || 0,
            description: 'AI-processed calls'
        },
        {
            id: 'non-ai',
            label: 'Non-AI Calls',
            color: 'error',
            count: tabCounts['non-ai'] || 0,
            description: 'Manual processing required'
        },
        {
            id: 'completed',
            label: 'Completed',
            color: 'success',
            count: tabCounts.completed || 0,
            description: 'Successfully completed jobs'
        },
        {
            id: 'demo',
            label: 'Demo Jobs',
            color: 'warning',
            count: tabCounts.demo || 0,
            description: 'Training and demo purposes'
        },
        {
            id: 'my-jobs',
            label: 'My Jobs',
            color: 'info',
            count: tabCounts['my-jobs'] || 0,
            description: 'Assigned to you'
        }
    ]

    const JobCategoryItem = ({ category }) => (
        <Box sx={{ 
            p: 1.5, 
            border: '1px solid', 
            borderColor: 'grey.200',
            borderRadius: 1,
            mb: 1,
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: 'grey.50'
            }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {category.label}
                </Typography>
                <Chip 
                    label={category.count} 
                    color={category.color}
                    size="small"
                    variant="filled"
                />
            </Box>
            <Typography variant="caption" color="text.secondary">
                {category.description}
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
                    width: 280,
                    maxHeight: 500,
                    p: 2
                }
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Job Categories
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
                {jobCategories.map(category => (
                    <JobCategoryItem key={category.id} category={category} />
                ))}
            </Box>

            <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Real-time job distribution
                </Typography>
            </Box>
        </Popover>
    )
}

export default JobsCountCard