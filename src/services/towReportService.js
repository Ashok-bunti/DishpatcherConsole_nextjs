import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

// API functions
export const towReportAPI = {
  getTowReports: async (params = {}) => {
    const queryParams = new URLSearchParams(params)
    return apiClient.get(`/towreport?${queryParams}`)
  },

  getAIDashboard: async (params = {}) => {
    const queryParams = new URLSearchParams(params)
    return apiClient.get(`/AIcalldashboard?${queryParams}`)
  },

  getTowReportById: async (id) => {
    return apiClient.get(`/towreport/${id}`)
  },

  updateTowReport: async (id, payload) => {
    return apiClient.put(`/towreport/${id}`, payload)
  },

  makeAICall: async (payload) => {
    return apiClient.post('/easytowcall', payload)
  },

  searchTowReports: async (params) => {
    const queryParams = new URLSearchParams(params)
    return apiClient.get(`/towreport/search?${queryParams}`)
  },

  advancedSearch: async (params) => {
    const queryParams = new URLSearchParams(params)
    return apiClient.get(`/towreport/advsearch?${queryParams}`)
  },

  closeCall: async (id, closeData) => {
    return apiClient.put(`/towreport/closeCall/${id}`, closeData)
  },

  getVehicleDetails: async (vehicleName) => {
    return apiClient.get(`/vehicledetails/name/${encodeURIComponent(vehicleName)}`)
  },

  getCallScripts: async () => {
    return apiClient.get('/callscript')
  },

  getKeyJobDetails: async () => {
    return apiClient.get('/keyjobdetails')
  },

  getAvailableDrivers: async () => {
    return apiClient.get('/shifts/availableDrivers?startDateTime=2025-04-02T10:07:00&endDateTime=2025-12-02T10:07:00')
  },

  getAccounts: async () => {
    return apiClient.get('/accounts')
  },

  getStats: async () => {
    return apiClient.get('/towreport/stats')
  },
}

// React Query Hooks
export const useTowReports = (params = {}) => {
  return useQuery({
    queryKey: ['towReports', params],
    queryFn: () => towReportAPI.getTowReports(params),
    staleTime: 30000,
  })
}

export const useAIDashboard = (params = {}) => {
  return useQuery({
    queryKey: ['aiDashboard', params],
    queryFn: () => towReportAPI.getAIDashboard(params),
    staleTime: 10000,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })
}

export const useTowReport = (id) => {
  return useQuery({
    queryKey: ['towReport', id],
    queryFn: () => towReportAPI.getTowReportById(id),
    enabled: !!id,
  })
}

export const useUpdateTowReport = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }) => towReportAPI.updateTowReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towReports'] })
      queryClient.invalidateQueries({ queryKey: ['aiDashboard'] })
    },
  })
}

export const useMakeAICall = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload) => towReportAPI.makeAICall(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiDashboard'] })
    },
  })
}

export const useCloseCall = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, closeData }) => towReportAPI.closeCall(id, closeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towReports'] })
      queryClient.invalidateQueries({ queryKey: ['aiDashboard'] })
    },
  })
}

export const useSearchTowReports = (params) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => towReportAPI.searchTowReports(params),
    enabled: !!params?.search,
    staleTime: 0,
  })
}

export const useAdvancedSearch = (params) => {
  return useQuery({
    queryKey: ['advancedSearch', params],
    queryFn: () => towReportAPI.advancedSearch(params),
    enabled: !!(params?.phone || params?.po || params?.vehicle || params?.startDate || params?.endDate),
    staleTime: 0,
  })
}

export const useVehicleDetails = (vehicleName) => {
  return useQuery({
    queryKey: ['vehicleDetails', vehicleName],
    queryFn: () => towReportAPI.getVehicleDetails(vehicleName),
    enabled: !!vehicleName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCallScripts = () => {
  return useQuery({
    queryKey: ['callScripts'],
    queryFn: () => towReportAPI.getCallScripts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => towReportAPI.getAccounts(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => towReportAPI.getStats(),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refresh every minute
  })
}