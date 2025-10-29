'use client'

import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Divider
} from '@mui/material'
import { AccountCircle, Logout, Settings } from '@mui/icons-material'

const UserInfo = () => {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        dispatch(logout())
        handleMenuClose()
    }

    const getUserInitials = () => {
        if (!user?.displayName) return 'U'
        return user.displayName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
                onClick={handleMenuOpen}
                sx={{
                    p: 0,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}
                >
                    {getUserInitials()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 200,
                        mt: 1.5
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.displayName || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user?.email || 'user@example.com'}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleMenuClose}>
                    <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
                    Profile
                </MenuItem>

                <MenuItem onClick={handleMenuClose}>
                    <Settings sx={{ mr: 2, fontSize: 20 }} />
                    Settings
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default UserInfo