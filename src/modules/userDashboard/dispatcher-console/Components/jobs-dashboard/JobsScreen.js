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
  clearAllSearches,
  setSearchResultsManually,
} from '../../../../../store/slices/driverLocationSlice'
import { setShowSidebar } from '../../../../../store/slices/uiSlice'
import { Box, Typography, Tooltip, IconButton } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import JobSection from "./JobSection/JobSection"
import JobsSidebar from "./JobsSidebar"
import AppLoader from '../../../../../@crema/components/AppLoader/index'
import AppHeader from "@crema/components/AppLayout/UserMiniHeader/AppHeader"

const SECTION_CONFIG = {
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

const INITIAL_PAGINATION = {
  ai: { page: 1, pageSize: 4 },
  'non-ai': { page: 1, pageSize: 4 },
  completed: { page: 1, pageSize: 4 },
  demo: { page: 1, pageSize: 4 },
  'my-jobs': { page: 1, pageSize: 4 },
}

export default function JobsScreen() {
  const dispatch = useAppDispatch()
  const {
    selectedAccount,
    selectedStatusTab,
    searchTerm,
    searchResults,
    searchType,
    accountData,
    timeData,
    advancedSearchParams
  } = useAppSelector((state) => state.driverLocation)
  
  const { showSidebar } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)

  const [sectionPagination, setSectionPagination] = useState(INITIAL_PAGINATION)
  const [statsAnchorEl, setStatsAnchorEl] = useState(null)
  const [jobsCountAnchorEl, setJobsCountAnchorEl] = useState(null)

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

  const shouldSearch = searchTerm && 
    searchTerm.trim() !== "" && 
    searchTerm !== '__ADVANCED_SEARCH_ACTIVE__' && 
    searchType === 'basic'

  const {
    data: searchData,
    isLoading: searchLoading
  } = useSearchTowReports(
    shouldSearch ? { search: searchTerm, account: selectedAccount } : null
  )

  const shouldAdvancedSearch = useMemo(() => {
    return searchType === 'advanced' && 
      advancedSearchParams && 
      (
        advancedSearchParams.phone || 
        advancedSearchParams.po || 
        advancedSearchParams.vehicle || 
        advancedSearchParams.startDate || 
        advancedSearchParams.endDate
      )
  }, [searchType, advancedSearchParams])

  const {
    data: advancedSearchData,
    isLoading: advancedSearchLoading,
    error: advancedSearchError
  } = useAdvancedSearch(
    shouldAdvancedSearch ? {
      ...advancedSearchParams,
      account: selectedAccount
    } : null
  )

  const { data: accountsData } = useAccounts()
  const { data: statsData } = useStats()

  const hasActiveSearch = useMemo(() => {
    if (searchType === 'advanced') {
      return shouldAdvancedSearch
    }
    return !!(searchTerm && 
      searchTerm.trim() !== "" && 
      searchTerm !== '__ADVANCED_SEARCH_ACTIVE__' && 
      searchType === 'basic')
  }, [searchTerm, searchType, shouldAdvancedSearch])

  const isSearching = useMemo(() => {
    return hasActiveSearch && (searchLoading || advancedSearchLoading)
  }, [hasActiveSearch, searchLoading, advancedSearchLoading])

  useEffect(() => {
    if (dashboardData?.value) {
      dispatch(setTowReports(dashboardData.value))
    }
  }, [dashboardData, dispatch])

  useEffect(() => {
    if (searchData && shouldSearch) {
      let resultsArray = []

      if (searchData && typeof searchData === 'object' && !Array.isArray(searchData)) {
        if (searchData._id || searchData.id || searchData.po) {
          resultsArray = [searchData]
        } else if (searchData.success && Array.isArray(searchData.data)) {
          resultsArray = searchData.data
        } else if (Array.isArray(searchData.value)) {
          resultsArray = searchData.value
        }
      } else if (Array.isArray(searchData)) {
        resultsArray = searchData
      }

      dispatch(setSearchResultsManually(resultsArray))
    }
  }, [searchData, shouldSearch, dispatch])

  useEffect(() => {
    if (advancedSearchData && shouldAdvancedSearch) {
      let resultsArray = []

      if (advancedSearchData && 
          typeof advancedSearchData === 'object' && 
          !Array.isArray(advancedSearchData) &&
          advancedSearchData.success === true && 
          Array.isArray(advancedSearchData.data)) {
        resultsArray = advancedSearchData.data
      } else if (Array.isArray(advancedSearchData)) {
        resultsArray = advancedSearchData
      } else if (advancedSearchData && Array.isArray(advancedSearchData.value)) {
        resultsArray = advancedSearchData.value
      } else if (advancedSearchData && 
                typeof advancedSearchData === 'object' && 
                !Array.isArray(advancedSearchData) &&
                (advancedSearchData._id || advancedSearchData.id || advancedSearchData.po)) {
        resultsArray = [advancedSearchData]
      }

      dispatch(setSearchResultsManually(resultsArray))
    }
  }, [advancedSearchData, shouldAdvancedSearch, dispatch])

  useEffect(() => {
    if (!searchTerm || 
        searchTerm.trim() === "" || 
        searchTerm === '__ADVANCED_SEARCH_ACTIVE__') {
      if (searchType !== 'advanced') {
        dispatch(setSearchResults([]))
        dispatch(setSearchType(''))
      }
    }
  }, [searchTerm, searchType, dispatch])

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

  const categorizedData = useMemo(() => {
    const data = hasActiveSearch ? searchResults : (dashboardData?.value || [])
    const loggedInUserId = user?.id
    const isSearchMode = hasActiveSearch && data.length > 0

    if (!Array.isArray(data)) {
      return {
        ai: [],
        'non-ai': [],
        completed: [],
        demo: [],
        'my-jobs': []
      }
    }

    const categorized = {
      ai: data.filter(item => {
        if (!item) return false
        
        const isCorrectAccount = item?.account === selectedAccount
        const isNotCompleted = item?.tx_job_status !== "completed"
        const isAiEnabled = item?.ai_call_disabled === false
        const notFailed = item?.cx_call !== "ai_call_failed"
        const notNegative = item?.easy_tow?.responseText?.CallScoreReview !== "Negative"
        const notNeutral = item?.easy_tow?.responseText?.CallScoreReview !== "Neutral"
        
        if (isSearchMode) {
          return isCorrectAccount && isAiEnabled && isNotCompleted && notFailed
        }
        
        return isCorrectAccount && isAiEnabled && isNotCompleted && notFailed && notNegative && notNeutral
      }),

      'non-ai': data.filter(item => {
        if (!item) return false
        
        const isCorrectAccount = item?.account === selectedAccount
        const isNotCompleted = item?.tx_job_status !== "completed"
        const isAiDisabled = item?.ai_call_disabled === true
        const isEscalated = item?.escalated === true
        const isFailed = ["ai_call_failed", "ended"].includes(item?.cx_call)
        const isNegativeOrNeutral = ["Negative", "Neutral"].includes(
          item?.easy_tow?.responseText?.CallScoreReview
        )
        
        if (isSearchMode) {
          return isCorrectAccount && ((isAiDisabled && isNotCompleted) || 
                 (isEscalated && isNotCompleted && isFailed && isNegativeOrNeutral))
        }
        
        return isCorrectAccount && ((isAiDisabled && isNotCompleted) || 
               (isEscalated && isNotCompleted && isFailed && isNegativeOrNeutral))
      }),

      completed: data.filter(item => {
        if (!item) return false
        const isCorrectAccount = item?.account === selectedAccount
        return isCorrectAccount && item?.tx_job_status === "completed"
      }),

      demo: data.filter(item => {
        if (!item) return false
        const isCorrectAccount = item?.account === selectedAccount
        return isCorrectAccount && item?.po?.startsWith("PO-") && item?.tx_job_status !== "completed"
      }),

      'my-jobs': data.filter(item => {
        if (!item) return false
        const isCorrectAccount = item?.account === selectedAccount
        return isCorrectAccount && item?.processed_by?._id === loggedInUserId
      })
    }

    return categorized
  }, [dashboardData, searchResults, hasActiveSearch, selectedAccount, user, searchType])

  const filteredSections = useMemo(() => {
    if (!hasActiveSearch) {
      return ['ai', 'non-ai', 'completed', 'demo', 'my-jobs']
    }

    const sections = ['ai', 'non-ai', 'completed', 'demo', 'my-jobs'].filter(section =>
      categorizedData[section] && categorizedData[section].length > 0
    )

    return sections
  }, [categorizedData, hasActiveSearch, searchType])

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

  const tabCounts = useMemo(() => ({
    all: (categorizedData.ai?.length || 0) + (categorizedData['non-ai']?.length || 0),
    ai: categorizedData.ai?.length || 0,
    "non-ai": categorizedData['non-ai']?.length || 0,
    completed: categorizedData.completed?.length || 0,
    demo: categorizedData.demo?.length || 0,
    "my-jobs": categorizedData['my-jobs']?.length || 0,
  }), [categorizedData])

  const isLoading = dashboardLoading || isSearching

  if (dashboardError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error loading dashboard: {dashboardError.message}
        </Typography>
      </Box>
    )
  }

  const renderNoResults = (message, subtitle = "") => (
    <Box sx={{ textAlign: 'center', py: 8, mt: -8 }}>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )

  const renderAllSections = () => {
    if (isSearching) {
      return <AppLoader />
    }
    
    const sectionsToRender = hasActiveSearch
      ? filteredSections
      : ['ai', 'non-ai', 'completed', 'demo', 'my-jobs']

    if (hasActiveSearch) {
      if (searchResults.length === 0) {
        return renderNoResults(
          "No jobs found matching your search criteria",
          "Try adjusting your search terms or filters"
        )
      }

      if (sectionsToRender.length === 0) {
        return renderNoResults(
          `Found ${searchResults.length} job(s) but they don't match the current category filters`,
          "Try selecting \"All\" tab to view all search results"
        )
      }
    }

    return (
      <>
        {sectionsToRender.includes('ai') && (
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
              isSearchResult={hasActiveSearch}
            />
          </Box>
        )}

        {sectionsToRender.includes('non-ai') && (
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
              isSearchResult={hasActiveSearch}
            />
          </Box>
        )}

        {sectionsToRender.includes('completed') && (
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
              isSearchResult={hasActiveSearch}
            />
          </Box>
        )}

        {sectionsToRender.includes('demo') && (
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
              isSearchResult={hasActiveSearch}
            />
          </Box>
        )}

        {sectionsToRender.includes('my-jobs') && (
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
              isSearchResult={hasActiveSearch}
            />
          </Box>
        )}
      </>
    )
  }

  const renderSelectedSection = () => {
    const config = SECTION_CONFIG[selectedStatusTab]

    if (!config) return renderAllSections()
    
    if (isSearching) {
      return <AppLoader />
    }
    
    const hasData = categorizedData[selectedStatusTab]?.length > 0
    
    if (hasActiveSearch && !hasData) {
      return renderNoResults(
        `No ${config.title.toLowerCase()} found matching your search criteria`,
        "Try adjusting your search terms or switch to \"All\" to see other results"
      )
    }
    
    if (!hasData) {
      return renderNoResults(`No ${config.title.toLowerCase()} available`)
    }

    return (
      <Box id={config.id} sx={{ mb: 0, mt: -8 }}>
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
          isSearchResult={hasActiveSearch}
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
              hasActiveSearch={hasActiveSearch}
            />
          </Box>
        )}

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

      <Box>
        {dashboardLoading && !hasActiveSearch ? (
          <AppLoader />
        ) : selectedStatusTab === "all" ? (
          renderAllSections()
        ) : (
          renderSelectedSection()
        )}
      </Box>
    </Box>
  )
}