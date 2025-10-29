
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export const ACCOUNT_COLORS = {
    'QT-SD': '#1B2064',
    'Pantusa Atlanta': '#2E7D32',
    'Pantusa Nashville': '#ED6C02',
    'Duggers': '#D32F2F',
    'Empire': '#9C27B0',
    '777': '#0288D1'
}

export const STATUS_COLORS = {
    'completed': '#4CAF50',
    'pending': '#FF9800',
    'in_progress': '#2196F3',
    'cancelled': '#F44336',
    'assigned': '#9C27B0'
}

export const AI_CALL_STATUS = {
    INITIATED: 'ai_call_initiated',
    COMPLETED: 'ai_call_completed',
    FAILED: 'ai_call_failed',
    ENDED: 'ended'
}

export const JOB_TYPES = {
    LIVE_DATA: 'live_data',
    MOCK_JOB: 'mock_job',
    DEMO: 'demo'
}

export const TIMEZONES = {
    EST: 'America/New_York',
    CST: 'America/Chicago',
    MST: 'America/Denver',
    PST: 'America/Los_Angeles'
}

export const DEFAULT_PAGINATION = {
    page: 1,
    pageSize: 4,
    totalCount: 0,
    totalPages: 0
}

export const SEARCH_DEBOUNCE = 500 // milliseconds

export const REFETCH_INTERVALS = {
    DASHBOARD: 30000, // 30 seconds
    STATS: 60000, // 1 minute
    AI_CALLS: 5000 // 5 seconds
}

export const STALE_TIMES = {
    DASHBOARD: 10000, // 10 seconds
    VEHICLE_DETAILS: 300000, // 5 minutes
    CONFIGURATIONS: 300000, // 5 minutes
    ACCOUNTS: 600000 // 10 minutes
}