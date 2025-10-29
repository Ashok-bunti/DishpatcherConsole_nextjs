'use client'

import React from 'react'
import { Box, Typography, List, ListItem, ListItemIcon, Divider, ListItemButton } from '@mui/material'
import WorkOutline from '@mui/icons-material/WorkOutline'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PsychologyIcon from '@mui/icons-material/Psychology'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import ThumbUp from '@mui/icons-material/ThumbUp'
import StarIcon from '@mui/icons-material/Star'
import AppCard from '../../../../../@crema/components/AppCard/index'

const customColors = {
    navBackground: '#f8fafc',
    navBorder: '#e2e8f0',
    hoverBackground: '#edf2f7',
    selectedBackground: '#C4FF84',
    selectedText: '#1a202c',
    iconColor: '#4a5568',
    divider: '#e2e8f0',
    primary: '#2d3748',
}

const JobsSidebar = ({ selectedTab, onTabChange, tabCounts, selectedAccount = 'all', isLoading = false }) => {
    const handleTabClick = (tabId) => {
        onTabChange(tabId)

        const sectionId = `section-${tabId}`
        const sectionElement = document.getElementById(sectionId)

        if (sectionElement) {
            const stickyHeader = document.querySelector('.sticky-sidebar')
            const headerHeight = stickyHeader ? stickyHeader.offsetHeight : 65

            const elementPosition = sectionElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    const sidebarTabs = [
        {
            id: 'all',
            label: 'All Jobs',
            icon: <WorkOutline />,
            color: '#4a5568'
        },
        {
            id: 'ai',
            label: 'AI',
            icon: <AutoAwesomeIcon />,
            color: '#9B1FE9'
        },
        {
            id: 'non-ai',
            label: 'Non-AI',
            icon: <PsychologyIcon />,
            color: '#1664C0'
        },
        {
            id: 'completed',
            label: 'Completed',
            icon: <DoneOutlineIcon />,
            color: '#38a169'
        },
        {
            id: 'demo',
            label: 'Demo',
            icon: <ThumbUp />,
            color: '#dd6b20'
        },
        {
            id: 'my-jobs',
            label: 'My Jobs',
            icon: <StarIcon />,
            color: '#e53e3e'
        }
    ]

    const renderTabItem = (tab, index) => (
        <React.Fragment key={tab.id}>
            <ListItem
                disablePadding
                sx={{
                    minWidth: '85px',
                    height: '60px',
                    margin: '0 1px',
                }}
            >
                <ListItemButton
                    selected={selectedTab === tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isLoading}
                    sx={{
                        py: 1,
                        px: 1,
                        flexDirection: 'column',
                        height: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        '&.Mui-selected': {
                            backgroundColor: customColors.selectedBackground,
                            color: customColors.selectedText,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            '& .MuiListItemIcon-root': {
                                color: customColors.selectedText,
                            },
                            '&:hover': {
                                backgroundColor: '#b0f566',
                                transform: 'translateY(-1px)',
                            }
                        },
                        '&:hover': {
                            backgroundColor: customColors.hoverBackground,
                            transform: 'translateY(-1px)',
                            transition: 'all 0.2s ease',
                        },
                        '&.Mui-disabled': {
                            opacity: 0.5,
                            pointerEvents: 'none'
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            px: 0,
                            m: 0,
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            gap: 0.3,
                            position: 'relative',
                            minHeight: '38px'
                        }}>
                            {isLoading ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 0.3,
                                    width: '100%'
                                }}>
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0,0,0,0.08)',
                                            animation: 'pulse 1.5s ease-in-out infinite'
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 45,
                                            height: 8,
                                            borderRadius: 1,
                                            backgroundColor: 'rgba(0,0,0,0.08)',
                                            animation: 'pulse 1.5s ease-in-out infinite'
                                        }}
                                    />
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 24,
                                        height: 24
                                    }}>
                                        {React.cloneElement(tab.icon, {
                                            sx: {
                                                color: selectedTab === tab.id ? customColors.selectedText : tab.color,
                                                fontSize: 20,
                                                filter: selectedTab === tab.id
                                                    ? `drop-shadow(0 1px 2px rgba(0,0,0,0.1))` : 'none'
                                            }
                                        })}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: selectedTab === tab.id ? customColors.selectedText : '#4a5568',
                                            fontSize: '0.65rem',
                                            fontWeight: selectedTab === tab.id ? 600 : 500,
                                            lineHeight: 1,
                                            textAlign: 'center',
                                            textTransform: 'capitalize',
                                            width: '100%',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '70px',
                                            minHeight: '12px',
                                            letterSpacing: '0.1px'
                                        }}
                                    >
                                        {tab.label || 'Label'}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            {index < sidebarTabs.length - 1 && (
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        borderColor: customColors.divider,
                        my: 0.3,
                        height: '30px',
                        alignSelf: 'center'
                    }}
                />
            )}
        </React.Fragment>
    )

    return (
        <AppCard
            className="sticky-sidebar"
            sx={{
                width: 'fit-content',
                minWidth: '520px',
                margin: '0 auto',
                zIndex: 1000,
                border: `1px solid ${customColors.navBorder}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '60px',
                minHeight: '60px',
                maxHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                padding: '0 8px',
                '&::-webkit-scrollbar': {
                    height: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '2px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                },
            }}
        >
            <List sx={{
                p: 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                gap: 0
            }}>
                {sidebarTabs.map((tab, index) => renderTabItem(tab, index))}
            </List>

            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </AppCard>
    )
}

export default JobsSidebar