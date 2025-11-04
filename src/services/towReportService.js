import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

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
    const filteredParams = Object.entries(params)
      .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    
    const queryParams = new URLSearchParams(filteredParams)
    
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
    updateTowReport: async ({ id, payload }) => {
    const response = await apiClient.put(`/towreport/${id}`, payload)
    return response.data
  },
}

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
    refetchInterval: 30000,
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
    mutationFn: ({ id, payload }) => towReportAPI.updateTowReport({ id, payload }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['towReports'] })
      queryClient.invalidateQueries({ queryKey: ['aiDashboard'] })
      queryClient.invalidateQueries({ queryKey: ['towReport', variables.id] })
      
      // Update the cache for the specific report
      queryClient.setQueryData(['towReport', variables.id], data)
    },
    onError: (error) => {
      console.error('Error updating tow report:', error)
    }
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}

export const useVehicleDetails = (vehicleName) => {
  return useQuery({
    queryKey: ['vehicleDetails', vehicleName],
    queryFn: () => towReportAPI.getVehicleDetails(vehicleName),
    enabled: !!vehicleName,
    staleTime: 300000,
  })
}

export const useCallScripts = () => {
  return useQuery({
    queryKey: ['callScripts'],
    queryFn: () => towReportAPI.getCallScripts(),
    staleTime: 600000,
  })
}

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => towReportAPI.getAccounts(),
    staleTime: 600000,
  })
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => towReportAPI.getStats(),
    staleTime: 60000,
    refetchInterval: 60000,
  })
}
