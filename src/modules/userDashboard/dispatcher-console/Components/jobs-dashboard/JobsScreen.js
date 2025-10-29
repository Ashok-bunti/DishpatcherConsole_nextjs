'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks/index'
import { useAIDashboard, useSearchTowReports, useAdvancedSearch, useAccounts, useStats } from '../../../../../services/towReportService'
import {
  setTowReports,
  setSelectedAccount,
  setSearchTerm,
  setSearchResults,
  setSearchType,
  setAccountData,
  setSelectedStatusTab,
  clearAllSearches
} from '../../../../../store/slices/driverLocationSlice'
import { setShowSidebar } from '../../../../../store/slices/uiSlice'
import { Box, Typography, Tooltip, IconButton } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import JobSection from "./JobSection/JobSection"
import JobsSidebar from "./JobsSidebar"
import AppLoader from '../../../../../@crema/components/AppLoader/index'
import AppHeader from "@crema/components/AppLayout/UserMiniHeader/AppHeader"
// import StatusCountCard from '@/components/shared/StatusCountCard'
// import JobsCountCard from '@/components/shared/JobsCountCard'

export default function JobsScreen() {
  const dispatch = useAppDispatch()
  const {
    selectedAccount,
    selectedStatusTab,
    searchTerm,
    searchResults,
    searchType,
    accountData,
    timeData
  } = useAppSelector((state) => state.driverLocation)
  const { showSidebar } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)

  const [sectionPagination, setSectionPagination] = useState({
    ai: { page: 1, pageSize: 4 },
    'non-ai': { page: 1, pageSize: 4 },
    completed: { page: 1, pageSize: 4 },
    demo: { page: 1, pageSize: 4 },
    'my-jobs': { page: 1, pageSize: 4 },
  })

  const [statsAnchorEl, setStatsAnchorEl] = useState(null)
  const [jobsCountAnchorEl, setJobsCountAnchorEl] = useState(null)

  // Main data fetch with TanStack Query
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useAIDashboard({
    account: selectedAccount,
    skip: 0,
    top: 500,
  })

  // Search with TanStack Query
  const {
    data: searchData,
    isLoading: searchLoading
  } = useSearchTowReports(
    searchTerm && searchType === 'basic'
      ? { search: searchTerm, account: selectedAccount }
      : null
  )

  // Advanced Search
  const {
    data: advancedSearchData,
    isLoading: advancedSearchLoading
  } = useAdvancedSearch(
    searchType === 'advanced' ? {
      ...searchTerm,
      account: selectedAccount
    } : null
  )

  // Accounts data
  const { data: accountsData } = useAccounts()

  // Stats data
  const { data: statsData } = useStats()

  // Update Redux store when data changes
  useEffect(() => {
    if (dashboardData?.value) {
      dispatch(setTowReports(dashboardData.value))
    }
  }, [dashboardData, dispatch])

  useEffect(() => {
    if (searchData) {
      dispatch(setSearchResults(searchData))
    }
  }, [searchData, dispatch])

  useEffect(() => {
    if (advancedSearchData) {
      dispatch(setSearchResults(advancedSearchData))
    }
  }, [advancedSearchData, dispatch])

  useEffect(() => {
    if (accountsData?.results) {
      dispatch(setAccountData(accountsData.results))
    }
  }, [accountsData, dispatch])

  const handleSectionPageChange = (sectionType, page, pageSize) => {
    setSectionPagination(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        page,
        ...(pageSize && { pageSize }),
      },
    }))
  }

  const handleRowsPerPageChange = (sectionType, newPageSize) => {
    setSectionPagination(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        page: 1,
        pageSize: newPageSize,
      },
    }))
  }

  const handleStatusTabChange = (tabId) => {
    dispatch(setSelectedStatusTab(tabId))
  }

  // Data categorization logic
  const categorizedData = useMemo(() => {
    const data = searchType !== 'basic' && searchResults.length > 0 ? searchResults : (dashboardData?.value || [])

    if (!Array.isArray(data)) return {
      ai: [],
      'non-ai': [],
      completed: [],
      demo: [],
      'my-jobs': []
    }

    const loggedInUserId = user?.id

    return {
      ai: data.filter(item =>
        item?.account === selectedAccount &&
        item?.ai_call_disabled === false &&
        item?.tx_job_status !== "completed" &&
        item?.cx_call !== "ai_call_failed" &&
        item?.easy_tow?.responseText?.CallScoreReview !== "Negative" &&
        item?.easy_tow?.responseText?.CallScoreReview !== "Neutral"
      ),

      'non-ai': data.filter(item =>
        (item?.ai_call_disabled === true && item?.tx_job_status !== "completed") ||
        (item?.escalated === true &&
          item?.tx_job_status !== "completed" &&
          ["ai_call_failed", "ended"].includes(item?.cx_call) &&
          (item?.easy_tow?.responseText?.CallScoreReview === "Negative" ||
            item?.easy_tow?.responseText?.CallScoreReview === "Neutral"))
      ),

      completed: data.filter(item => item?.tx_job_status === "completed"),

      demo: data.filter(item =>
        item?.po?.startsWith("PO-") &&
        item?.tx_job_status !== "completed"
      ),

      'my-jobs': data.filter(item =>
        item?.processed_by?._id === loggedInUserId &&
        (item?.tx_job_status !== "completed" || item?.tx_job_status === "completed")
      )
    }
  }, [dashboardData, searchResults, searchType, selectedAccount, user])

  // Section display data with pagination
  const sectionDisplayData = useMemo(() => {
    const getPaginatedData = (data, sectionType) => {
      const currentPage = sectionPagination[sectionType].page
      const pageSize = sectionPagination[sectionType].pageSize
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize

      return data.slice(startIndex, endIndex)
    }

    return {
      ai: getPaginatedData(categorizedData.ai || [], 'ai'),
      'non-ai': getPaginatedData(categorizedData['non-ai'] || [], 'non-ai'),
      completed: getPaginatedData(categorizedData.completed || [], 'completed'),
      demo: getPaginatedData(categorizedData.demo || [], 'demo'),
      'my-jobs': getPaginatedData(categorizedData['my-jobs'] || [], 'my-jobs')
    }
  }, [categorizedData, sectionPagination])

  // Pagination info
  const sectionPaginationInfo = useMemo(() => {
    const getPaginationInfo = (data, sectionType) => {
      const totalRecords = data ? data.length : 0
      const pageSize = sectionPagination[sectionType].pageSize
      const totalPages = Math.ceil(totalRecords / pageSize)
      const currentPage = sectionPagination[sectionType].page

      return {
        currentPage,
        totalPages,
        totalRecords,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    }

    return {
      ai: getPaginationInfo(categorizedData.ai || [], 'ai'),
      'non-ai': getPaginationInfo(categorizedData['non-ai'] || [], 'non-ai'),
      completed: getPaginationInfo(categorizedData.completed || [], 'completed'),
      demo: getPaginationInfo(categorizedData.demo || [], 'demo'),
      'my-jobs': getPaginationInfo(categorizedData['my-jobs'] || [], 'my-jobs')
    }
  }, [categorizedData, sectionPagination])

  const handleDataUpdate = () => {
    refetchDashboard()
  }

  const handleStatsClick = (event) => setStatsAnchorEl(event.currentTarget)
  const handleJobsCountClick = (event) => setJobsCountAnchorEl(event.currentTarget)

  const toggleSidebar = () => {
    dispatch(setShowSidebar(!showSidebar))
  }

  // Tab counts for sidebar
  const tabCounts = {
    all: (categorizedData.ai?.length || 0) + (categorizedData['non-ai']?.length || 0),
    ai: categorizedData.ai?.length || 0,
    "non-ai": categorizedData['non-ai']?.length || 0,
    completed: categorizedData.completed?.length || 0,
    demo: categorizedData.demo?.length || 0,
    "my-jobs": categorizedData['my-jobs']?.length || 0,
  }

  const isLoading = dashboardLoading || searchLoading || advancedSearchLoading

  if (dashboardError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error loading dashboard: {dashboardError.message}
        </Typography>
      </Box>
    )
  }

  const renderAllSections = () => (
    <>
      <Box id="section-ai" sx={{ mb: 4, mt: -8 }}>
        <JobSection
          label="AI Calls"
          color="#9B1FE9"
          filterType="ai"
          apiData={sectionDisplayData.ai}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo.ai}
          onPageChange={(page) => handleSectionPageChange('ai', page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange('ai', pageSize)}
          sectionCount={categorizedData.ai?.length || 0}
          timeData={timeData}
        />
      </Box>

      <Box id="section-non-ai" sx={{ mb: 4 }}>
        <JobSection
          label="Non-AI Calls"
          color="#1664C0"
          filterType="non-ai"
          apiData={sectionDisplayData['non-ai']}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo['non-ai']}
          onPageChange={(page) => handleSectionPageChange('non-ai', page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange('non-ai', pageSize)}
          sectionCount={categorizedData['non-ai']?.length || 0}
          timeData={timeData}
        />
      </Box>

      <Box id="section-completed" sx={{ mb: 4 }}>
        <JobSection
          label="Completed Calls"
          color="#4CAF50"
          filterType="completed"
          apiData={sectionDisplayData.completed}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo.completed}
          onPageChange={(page) => handleSectionPageChange('completed', page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange('completed', pageSize)}
          sectionCount={categorizedData.completed?.length || 0}
          timeData={timeData}
        />
      </Box>

      <Box id="section-demo" sx={{ mb: 4 }}>
        <JobSection
          label="Demo Jobs"
          color="#FF9800"
          filterType="demo"
          apiData={sectionDisplayData.demo}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo.demo}
          onPageChange={(page) => handleSectionPageChange('demo', page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange('demo', pageSize)}
          sectionCount={categorizedData.demo?.length || 0}
          timeData={timeData}
        />
      </Box>

      <Box id="section-my-jobs" sx={{ mb: 4 }}>
        <JobSection
          label="My Jobs"
          color="#F44336"
          filterType="my-jobs"
          apiData={sectionDisplayData['my-jobs']}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo['my-jobs']}
          onPageChange={(page) => handleSectionPageChange('my-jobs', page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange('my-jobs', pageSize)}
          sectionCount={categorizedData['my-jobs']?.length || 0}
          timeData={timeData}
        />
      </Box>
    </>
  )

  const renderSelectedSection = () => {
    const sectionConfig = {
      ai: {
        id: "section-ai",
        title: "AI Calls",
        color: "#9B1FE9",
        filterType: "ai"
      },
      "non-ai": {
        id: "section-non-ai",
        title: "Non-AI Calls",
        color: "#1664C0",
        filterType: "non-ai"
      },
      completed: {
        id: "section-completed",
        title: "Completed Calls",
        color: "#4CAF50",
        filterType: "completed"
      },
      demo: {
        id: "section-demo",
        title: "Demo Jobs",
        color: "#FF9800",
        filterType: "demo"
      },
      "my-jobs": {
        id: "section-my-jobs",
        title: "My Jobs",
        color: "#F44336",
        filterType: "my-jobs"
      }
    }

    const config = sectionConfig[selectedStatusTab]

    if (!config) return renderAllSections()

    return (
      <Box id={config.id} sx={{ mb: 0, mt:-8  }}>
        <JobSection
          label={config.title}
          color={config.color}
          filterType={config.filterType}
          apiData={sectionDisplayData[selectedStatusTab]}
          loggedInUserId={user?.id}
          onDataUpdate={handleDataUpdate}
          loading={isLoading}
          pagination={sectionPaginationInfo[selectedStatusTab]}
          onPageChange={(page) => handleSectionPageChange(selectedStatusTab, page)}
          onRowsPerPageChange={(pageSize) => handleRowsPerPageChange(selectedStatusTab, pageSize)}
          sectionCount={categorizedData[selectedStatusTab]?.length || 0}
          timeData={timeData}
        />
      </Box>
    )
  }

  return (
    <Box sx={{
      flexGrow: 1,
      p: 0,
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'text',
      overflow: 'visible',
      position: 'relative',
      minHeight: '100vh',
    }}>
      <AppHeader
        onStatsClick={handleStatsClick}
        onJobsCountClick={handleJobsCountClick}
      />

      {/* Sticky Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 40, sm: 55 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {showSidebar && (
          <Box sx={{ mt: 5 }}>
            <JobsSidebar
              selectedTab={selectedStatusTab}
              onTabChange={handleStatusTabChange}
              tabCounts={tabCounts}
              selectedAccount={selectedAccount}
              isLoading={isLoading}
            />
          </Box>
        )}

        {/* Sidebar Toggle Button */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: showSidebar ? '0 0 8px 8px' : '0 0 8px 8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            borderTop: showSidebar ? 'none' : 'none',
            mt: showSidebar ? 0.5 : 4,
          }}
        >
          <Tooltip title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: '#ffffff',
                backgroundColor: '#59a4eeff',
                padding: '4px 12px',
                borderRadius: '0 0 8px 8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {showSidebar ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Box >
        {isLoading ? (
          <AppLoader />
        ) : selectedStatusTab === "all" ? (
          renderAllSections()
        ) : (
          renderSelectedSection()
        )}
      </Box>

      {/* Popover Components */}
      {/* <StatusCountCard
        open={Boolean(statsAnchorEl)}
        anchorEl={statsAnchorEl}
        onClose={() => setStatsAnchorEl(null)}
        towReports={dashboardData?.value || []}
        selectedAccount={selectedAccount}
      />

      <JobsCountCard
        open={Boolean(jobsCountAnchorEl)}
        anchorEl={jobsCountAnchorEl}
        onClose={() => setJobsCountAnchorEl(null)}
        tabCounts={tabCounts}
      /> */}
    </Box>
  )
}