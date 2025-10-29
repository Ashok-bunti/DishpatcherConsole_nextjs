'use client'

import React, { createContext, useContext } from 'react'
import { useAppSelector } from '../../../../store/hooks/index'

// This context provides backward compatibility for components that still use Context API
export const DriverLocationContext = createContext()

export const DriverLocationProvider = ({ children }) => {
  const driverLocationState = useAppSelector((state) => state.driverLocation)
  const authState = useAppSelector((state) => state.auth)

  const contextValue = {
    // Driver Location State
    ...driverLocationState,
    
    // Auth State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    
    // Mock functions for legacy components
    seteasyCall: () => console.warn('Use Redux dispatch instead of seteasyCall'),
    setShare: () => console.warn('Use Redux dispatch instead of setShare'),
    setSelectedReport: () => console.warn('Use Redux dispatch instead of setSelectedReport'),
    updateProcessedByByPO: () => console.warn('Use Redux dispatch instead of updateProcessedByByPO'),
    updateData: () => console.warn('Use TanStack Query instead of updateData'),
    handleCardClick: () => console.warn('Use Redux dispatch instead of handleCardClick'),
    fetchTimeData: () => console.warn('Use custom hook instead of fetchTimeData'),
    updateCallStatus: () => console.warn('Use mutation instead of updateCallStatus'),
    updateHandledData: () => console.warn('Use TanStack Query instead of updateHandledData'),
    updateSelectedRecord: () => console.warn('Use TanStack Query instead of updateSelectedRecord'),
    handleAdvancedSearch: () => console.warn('Use TanStack Query instead of handleAdvancedSearch'),
    triggerSearchReset: () => console.warn('Use Redux dispatch instead of triggerSearchReset'),
  }

  return (
    <DriverLocationContext.Provider value={contextValue}>
      {children}
    </DriverLocationContext.Provider>
  )
}

export const useDriverLocation = () => {
  const context = useContext(DriverLocationContext)
  if (!context) {
    throw new Error('useDriverLocation must be used within a DriverLocationProvider')
  }
  return context
}