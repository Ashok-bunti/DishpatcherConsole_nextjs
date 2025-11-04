'use client'

import React, { useState, useEffect } from 'react'
import { Button, Box } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks/index'
import { setProcessedBy, setSelectedReport } from '../../../../../store/slices/driverLocationSlice'
import { useUpdateTowReport, useAIDashboard } from '../../../../../services/towReportService'
import { useConfigurationAPI } from '../../../../../services/configurationService'
import AppLoader from '../../../../../@crema/components/AppLoader/index'
import { useAuthMethod, useAuthUser } from '../../../../../@crema/hooks/AuthHooks';

const AcceptButton = ({
  row,
  selectedReport,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  onClick,
  onSuccess,
  ...rest
}) => {
  const dispatch = useAppDispatch()
  const reduxSelectedReport = useAppSelector((state) => state.driverLocation.selectedReport)
  const { semiAutoAiConfig } = useAppSelector((state) => state.driverLocation)
  const { user, isAuthenticated } = useAuthUser();

  const [isProcessing, setIsProcessing] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const currentReport = row || selectedReport || reduxSelectedReport

  const { mutateAsync: updateTowReport, isPending: isUpdating } = useUpdateTowReport()
  const { refetch: refetchAIDashboard } = useAIDashboard({
    account: currentReport?.account || 'QT-SD',
    skip: 0,
    top: 100,
  })
  const { configurations } = useConfigurationAPI()

  const processedBy = currentReport?.processed_by
  const loginuser = user?.email || user?.id
  const customerContact = currentReport?.customer_contact || ''

  const lastParenIndex = customerContact.lastIndexOf('(')
  let customerPhone = ''

  if (lastParenIndex !== -1) {
    customerPhone = customerContact.slice(lastParenIndex + 1).trim()
  }

  const cleanedPhone = customerPhone.replace(/\D/g, '')
  let formattedPhone = cleanedPhone

  if (cleanedPhone.length === 10) {
    formattedPhone = `+1 (${cleanedPhone.slice(0, 3)}) ${cleanedPhone.slice(3, 6)}-${cleanedPhone.slice(6)}`
  } else {
    formattedPhone = 'Invalid Number'
  }

  const getButtonState = async (report) => {
    if (report?.ai_call_disabled === true) {
      return true
    }

    try {
      if (!configurations || configurations.length === 0) {
        return false
      }

      const aiAccountFilters = configurations.find(
        (config) => config.key === 'AI Account Filters'
      )

      if (!aiAccountFilters) {
        return false
      }

      const filterValues = aiAccountFilters.value
        .split(',')
        .map((value) => value.trim())
      const accountType = report?.account_type || ''

      const isMatch = filterValues.some((keyword) =>
        accountType.includes(keyword)
      )

      return isMatch
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    if (!currentReport) return

    const checkButtonState = async () => {
      const shouldDisableButton = await getButtonState(currentReport)
      setIsDisabled(shouldDisableButton)
    }

    checkButtonState()
  }, [currentReport, configurations])

  const handleAccept = async () => {
    if (!currentReport?.id) {
      console.error('No report ID found')
      return
    }

    if (!user?.id) {
      console.error('No user ID found')
      return
    }

    setIsProcessing(true)

    try {
      const payload = {
        processed_by: user.id,
        action: 'accept',
      }

      const response = await updateTowReport({
        id: currentReport.id,
        payload: payload,
      })

      if (response?.data) {
        const updatedReport = response.data
        dispatch(setSelectedReport(updatedReport))
        dispatch(setProcessedBy(updatedReport?.processed_by))

        await refetchAIDashboard()
      } else if (response?.value?.[0]) {
        const updatedReport = response.value[0]
        dispatch(setSelectedReport(updatedReport))
        dispatch(setProcessedBy(updatedReport?.processed_by))
        await refetchAIDashboard()
      }

      if (onSuccess) {
        onSuccess()
      }

      if (onClick) {
        onClick()
      }
    } catch (error) {
      console.error('Error accepting job:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!currentReport) {
    return null
  }

  const isAcceptedByCurrentUser = processedBy && (
    processedBy?.email === user?.email ||
    processedBy?.id === user?.id
  )

  if (isAcceptedByCurrentUser) {
    return (
      <Button
        variant="contained"
        color="info"
        disabled
        startIcon={
          <LoginIcon
            sx={{
              color: '#1B2064',
              fontSize: 12,
              mt: '1px',
            }}
          />
        }
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: 'auto',
          backgroundColor: '#D9D9D9',
          color: '#1B2064',
          fontWeight: 600,
          '&.Mui-disabled': {
            backgroundColor: '#D9D9D9',
            color: '#1B2064',
          },
        }}
      >
        {processedBy?.name ? processedBy.name.substring(0, 5) : 'Accepted'}
      </Button>
    )
  }

  if (processedBy?.email || processedBy?._id || processedBy?.id) {
    return (
      <Button
        variant="contained"
        color="info"
        disabled
        startIcon={
          <LoginIcon
            sx={{
              color: '#fff',
              fontSize: 14,
              mt: '1px',
            }}
          />
        }
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: 'auto',
          backgroundColor: '#B0B0B0',
        }}
      >
        {processedBy?.name ? processedBy.name.substring(0, 5) : 'Accepted'}
      </Button>
    )
  }


  if (formattedPhone === 'Invalid Number') {
    return null
  }

  if (isDisabled) {
    return (
      <Button
        variant="contained"
        color="error"
        disabled
        startIcon={
          <LoginIcon
            sx={{
              color: 'gray',
              fontSize: 14,
              mt: '1px',
            }}
          />
        }
        sx={{
          fontSize: '0.7rem',
          px: 1.5,
          py: 0.6,
          minWidth: '70px',
          height: '28px',
          '&.Mui-disabled': {
            backgroundColor: '#ffcdd2',
            boxShadow: 'none',
            cursor: 'not-allowed',
            color: 'gray',
          },
        }}
      >
        Accept
      </Button>
    )
  }

  return (
    <Button
      variant="contained"
      color="info"
      onClick={handleAccept}
      disabled={isProcessing || isUpdating || disabled}
      startIcon={
        <LoginIcon
          sx={{
            color: '#1B2064',
            fontSize: 14,
            mt: '1px',
          }}
        />
      }
      sx={{
        fontSize: '0.7rem',
        boxShadow: 'none',
        px: 1.5,
        py: 0.6,
        width: '70px',
        height: '28px',
        backgroundColor: '#E3F2FD',
        color: '#1B2064',
        '&:hover': {
          backgroundColor: '#BBDEFB',
        },
      }}
    >
      {isProcessing || isUpdating ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            transform: 'scale(0.5)',
          }}
        >
          <AppLoader />
        </Box>
      ) : (
        'Accept'
      )}
    </Button>
  )
}

export default AcceptButton