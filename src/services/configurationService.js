import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

export const configurationAPI = {
  getConfigurations: async () => {
    return apiClient.get('/configurations')
  },

  updateConfiguration: async (id, payload) => {
    return apiClient.put(`/configurations/${id}`, payload)
  },
}

export const useConfigurations = () => {
  return useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationAPI.getConfigurations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useConfigurationAPI = () => {
  const { data: configurations, isLoading, error } = useConfigurations()

  const fetchConfigurations = async () => {
    return configurations || []
  }

  return {
    fetchConfigurations,
    configurations,
    isLoading,
    error,
  }
}